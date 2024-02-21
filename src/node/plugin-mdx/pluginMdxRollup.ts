import pluginMdx from '@mdx-js/rollup'
import remarkPluginGFM from 'remark-gfm'
import rehypePluginAutolinkHeadings from 'rehype-autolink-headings'
import rehypePluginSlug from 'rehype-slug'
import remarkPluginMDXFrontMatter from 'remark-mdx-frontmatter'
import remarkPluginFrontmatter from 'remark-frontmatter'
import type { Plugin } from 'vite'
import { getHighlighter, bundledLanguages, bundledThemes } from 'shiki'
import { rehypePluginShiki } from './rehypePlugins/shiki'
import { rehypePluginPreWrapper } from './rehypePlugins/preWrapper'
import { remarkPluginToc } from './remarkPlugins/toc'

export async function pluginMdxRollup(): Promise<Plugin> {
  return pluginMdx({
    remarkPlugins: [
      remarkPluginGFM,
      remarkPluginFrontmatter,
      [remarkPluginMDXFrontMatter, { name: 'frontmatter' }],
      remarkPluginToc
    ],
    rehypePlugins: [
      rehypePluginSlug,
      [
        rehypePluginAutolinkHeadings,
        {
          properties: {
            class: 'header-anchor'
          },
          content: {
            type: 'text',
            value: '#'
          }
        }
      ],
      rehypePluginPreWrapper as any,
      [
        rehypePluginShiki as any,
        {
          highlighter: await getHighlighter({
            themes: Object.keys(bundledThemes),
            langs: Object.keys(bundledLanguages)
          })
        }
      ]
    ]
  }) as unknown as Plugin
}
