import Slugger from 'github-slugger'
import { visit } from 'unist-util-visit'
import { Root } from 'mdast'
import { parse } from 'acorn'
import type { Plugin } from 'unified'
interface TocItem {
  id: string
  text: string
  depth: number
}

interface ChildNode {
  type: 'link' | 'text' | 'inlineCode'
  value: string
  children?: ChildNode[]
}

export const remarkPluginToc: Plugin<[], Root> = () => {
  return (tree) => {
    const toc: TocItem[] = []
    const slugger = new Slugger()
    let title = ''

    visit(tree, 'heading', (node) => {
      if (!node.depth || !node.children) return

      if (node.depth === 1) {
        title = (node.children[0] as ChildNode).value
      }

      // h2 ~ h4
      if (node.depth > 1 && node.depth < 5) {
        const originText = (node.children as ChildNode[])
          .map((child) => {
            switch (child.type) {
              case 'link':
                return child.children?.map((c) => c.value).join('') || ''
              default:
                return child.value
            }
          })
          .join('')
        // 对标题文本进行规范化
        const id = slugger.slug(originText)
        toc.push({
          id,
          text: originText,
          depth: node.depth
        })
      }
    })

    const insertCode = `export const toc = ${JSON.stringify(toc, null, 2)};`
    tree.children.push({
      type: 'mdxjsEsm',
      value: insertCode,
      data: {
        estree: parse(insertCode, {
          ecmaVersion: 2020,
          sourceType: 'module'
        }) as unknown
      }
    })

    if (title) {
      const insertedTitle = `export const title = '${title}';`

      tree.children.push({
        type: 'mdxjsEsm',
        value: insertedTitle,
        data: {
          estree: parse(insertedTitle, {
            ecmaVersion: 2020,
            sourceType: 'module'
          }) as unknown
        }
      })
    }
  }
}
