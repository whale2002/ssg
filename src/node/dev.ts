import { createServer } from 'vite'
import { pluginIndexHtml } from './plugin-island/indexHtml'
import pluginReact from '@vitejs/plugin-react' // 热更新是这个包实现的
import { pluginConfig } from './plugin-island/pluginConfig'
import { resolveConfig } from './config'
import { PACKAGE_ROOT } from './constants'
import { pluginRoutes } from './plugin-routes'

export async function createDevServer(
  root: string,
  restartDevServer: () => Promise<void>
) {
  const config = await resolveConfig(root, 'serve', 'development')

  return createServer({
    root: PACKAGE_ROOT,
    plugins: [
      pluginIndexHtml(),
      pluginReact(),
      pluginConfig(config, restartDevServer),
      pluginRoutes({
        root: config.root
      })
    ]
  })
}
