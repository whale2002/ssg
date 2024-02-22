import { SiteConfig } from 'shared/types'
import { pluginIndexHtml } from './plugin-island/indexHtml'
import pluginReact from '@vitejs/plugin-react'
import path from 'path'
import { pluginConfig } from './plugin-island/pluginConfig'
import { pluginRoutes } from './plugin-routes'
import { pluginMdx } from './plugin-mdx'
import pluginUnocss from 'unocss/vite'
import unocssOptions from './unocssOptions'
import { PACKAGE_ROOT } from './constants'
import babelPluginIsland from './babel-plugin-island'

export async function createVitePlugins(
  config: SiteConfig,
  restartServer?: () => Promise<void>,
  isSSR: boolean = false
) {
  return [
    pluginIndexHtml(),
    pluginReact({
      jsxRuntime: 'automatic',
      jsxImportSource: isSSR
        ? path.join(PACKAGE_ROOT, 'src', 'runtime')
        : 'react',
      babel: {
        plugins: [babelPluginIsland]
      }
    }),
    pluginConfig(config, restartServer),
    pluginRoutes({
      root: config.root,
      isSSR
    }),
    await pluginMdx(),
    pluginUnocss(unocssOptions)
  ]
}
