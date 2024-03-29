import { InlineConfig, build as viteBuild } from 'vite'
import type { RollupOutput } from 'rollup'
import {
  CLIENT_ENTRY_PATH,
  EXTERNALS,
  MASK_SPLITTER,
  PACKAGE_ROOT,
  SERVER_ENTRY_PATH
} from './constants'
import path, { join, dirname } from 'path'
import fs from 'fs-extra'
import { pathToFileURL } from 'url'
import { SiteConfig } from 'shared/types'
import { createVitePlugins } from './vitePlugins'
import { Route } from './plugin-routes'
import { RenderRusult } from 'runtime/ssr-entry'
import { HelmetData } from 'react-helmet-async'

const CLIENT_OUTPUT = 'build'

const normalizeVendorFilename = (fileName: string) =>
  fileName.replace(/\//g, '_') + '.js'

export async function build(root: string = process.cwd(), config: SiteConfig) {
  const [clientBundle] = await bundle(root, config)

  const serverEntryPath = join(root, '.temp', 'ssr-entry.js')
  const { render, routes } = await import(
    pathToFileURL(serverEntryPath).toString()
  )

  try {
    await renderPage(render, routes, root, clientBundle)
  } catch (e) {
    console.log('Render page error.\n', e)
  }
}

export async function bundle(root: string, config: SiteConfig) {
  const resolveViteConfig = async (
    isServer: boolean
  ): Promise<InlineConfig> => ({
    mode: 'production',
    root,
    plugins: await createVitePlugins(config, undefined, true),
    ssr: {
      // 注意加上这个配置，防止 cjs 产物中 require ESM 的产物，因为 react-router-dom 的产物为 ESM 格式
      noExternal: ['react-router-dom', 'lodash-es']
    },
    build: {
      ssr: isServer,
      outDir: isServer ? join(root, '.temp') : join(root, CLIENT_OUTPUT),
      rollupOptions: {
        input: isServer ? SERVER_ENTRY_PATH : CLIENT_ENTRY_PATH,
        output: {
          format: isServer ? 'cjs' : 'esm'
        },
        external: EXTERNALS
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
    const publicDir = join(root, 'public')
    if (fs.pathExistsSync(publicDir)) {
      await fs.copy(publicDir, join(root, CLIENT_OUTPUT))
    }
    await fs.copy(join(PACKAGE_ROOT, 'vendors'), join(root, CLIENT_OUTPUT))
    return [clientBundle, serverBundle] as [RollupOutput, RollupOutput]
  } catch (e) {
    console.log(e)
  }
}

export async function renderPage(
  render: (routePath: string, helmetContext: object) => Promise<RenderRusult>,
  routes: Route[],
  root: string,
  clientBundle: RollupOutput
) {
  console.log('Rendering page in server side...')
  const clientChunk = clientBundle.output.find(
    (chunk) => chunk.type === 'chunk' && chunk.isEntry
  )

  return Promise.all(
    [
      ...routes,
      {
        path: '/404'
      }
    ].map(async (route) => {
      const routePath = route.path
      const helmetContext = {
        context: {}
      } as HelmetData
      const {
        appHtml,
        islandProps = [],
        islandToPathMap
      } = await render(routePath, helmetContext.context)

      const { helmet } = helmetContext.context

      const styleAssets = clientBundle.output.filter(
        (chunk) => chunk.type === 'asset' && chunk.fileName.endsWith('.css')
      )
      const islandBundle = await buildIslands(root, islandToPathMap)
      const islandsCode = (islandBundle as RollupOutput).output[0].code

      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width,initial-scale=1">
            ${helmet?.title?.toString() || ''}
            ${helmet?.meta?.toString() || ''}
            ${helmet?.link?.toString() || ''}
            ${helmet?.style?.toString() || ''}
            <meta name="description" content="xxx">
            ${styleAssets
              .map((item) => `<link rel="stylesheet" href="/${item.fileName}">`)
              .join('\n')}
              <script type="importmap">
              {
                "imports": {
                  ${EXTERNALS.map(
                    (name) => `"${name}": "/${normalizeVendorFilename(name)}"`
                  ).join(',')}
                }
              }
            </script>
          </head>
          <body>
            <div id="root">${appHtml}</div>
            <script type="module">${islandsCode}</script>
            <script type="module" src="/${clientChunk?.fileName}"></script>
            <script id="island-props">${JSON.stringify(islandProps)}</script>
          </body>
        </html>
        `.trim()

      const fileName = routePath.endsWith('/')
        ? `${routePath}index.html`
        : `${routePath}.html`
      await fs.ensureDir(join(root, 'build', dirname(fileName)))
      await fs.writeFile(join(root, 'build', fileName), html)
    })
  )
}

async function buildIslands(
  root: string,
  islandPathToMap: Record<string, string>
) {
  const islandsInjectCode = `
    ${Object.entries(islandPathToMap)
      .map(
        ([islandName, islandPath]) =>
          `import { ${islandName} } from '${islandPath}';`
      )
      .join('')}
      window.ISLANDS = { ${Object.keys(islandPathToMap).join(', ')} };
      window.ISLAND_PROPS = JSON.parse(
        document.getElementById('island-props').textContent
      );
        `

  const injectId = 'island:inject'
  return viteBuild({
    mode: 'production',
    esbuild: {
      jsx: 'automatic'
    },
    build: {
      outDir: path.join(root, '.temp'),
      rollupOptions: {
        input: injectId,
        external: EXTERNALS
      }
    },
    plugins: [
      {
        name: 'island:inject',
        enforce: 'post',
        resolveId(id) {
          if (id.includes(MASK_SPLITTER)) {
            const [originId, importer] = id.split(MASK_SPLITTER)
            return this.resolve(originId, importer, { skipSelf: true })
          }

          if (id === injectId) {
            return id
          }
        },
        load(id) {
          if (id === injectId) {
            return islandsInjectCode
          }
        },
        generateBundle(_, bundle) {
          for (const name in bundle) {
            if (bundle[name].type === 'asset') {
              delete bundle[name]
            }
          }
        }
      }
    ]
  })
}
