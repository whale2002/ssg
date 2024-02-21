import { InlineConfig, build as viteBuild } from 'vite'
import type { RollupOutput } from 'rollup'
import { CLIENT_ENTRY_PATH, SERVER_ENTRY_PATH } from './constants'
import { join } from 'path'
import fs from 'fs-extra'
import { pathToFileURL } from 'url'
import { SiteConfig } from 'shared/types'
import { createVitePlugins } from './vitePlugins'

export async function bundle(root: string, config: SiteConfig) {
  const resolveViteConfig = async (
    isServer: boolean
  ): Promise<InlineConfig> => ({
    mode: 'production',
    root,
    plugins: await createVitePlugins(config),
    ssr: {
      // 注意加上这个配置，防止 cjs 产物中 require ESM 的产物，因为 react-router-dom 的产物为 ESM 格式
      noExternal: ['react-router-dom']
    },
    build: {
      ssr: isServer,
      outDir: isServer ? '.temp' : 'build',
      rollupOptions: {
        input: isServer ? SERVER_ENTRY_PATH : CLIENT_ENTRY_PATH,
        output: {
          format: isServer ? 'cjs' : 'esm'
        }
      }
    }
  })

  console.log(`Building client + server bundles...`)

  try {
    const [clientBundle, serverBundle] = await Promise.all([
      // client build
      viteBuild(await resolveViteConfig(false)),
      // server build
      viteBuild(await resolveViteConfig(true))
    ])
    return [clientBundle, serverBundle] as [RollupOutput, RollupOutput]
  } catch (e) {
    console.log(e)
  }
}

export async function build(root: string = process.cwd(), config: SiteConfig) {
  const [clientBundle] = await bundle(root, config)

  const serverEntryPath = join(root, '.temp', 'ssr-entry.js')
  const { render } = await import(pathToFileURL(serverEntryPath).toString())

  try {
    await renderPage(render, root, clientBundle)
  } catch (e) {
    console.log('Render page error.\n', e)
  }
}

export async function renderPage(
  render: () => string,
  root: string,
  clientBundle: RollupOutput
) {
  const clientChunk = clientBundle.output.find(
    (chunk) => chunk.type === 'chunk' && chunk.isEntry
  )
  console.log('Rendering page in server side...')
  const appHTML = render()

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <title>title</title>
        <meta name="description" content="xxx">
      </head>
      <body>
        <div id="root">${appHTML}</div>
        <script type="module" src="/${clientChunk?.fileName}"></script>
      </body>
    </html>
    `.trim()

  await fs.ensureDir(join(root, 'build'))
  await fs.writeFile(join(root, 'build/index.html'), html)
  await fs.remove(join(root, '.temp'))
}
