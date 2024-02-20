import { createServer } from 'vite'
import { pluginIndexHtml } from './plugins/indexHtml'
import pluginReact from '@vitejs/plugin-react' // 热更新是这个包实现的
import { pluginConfig } from './plugin-island/config'
import { resolveConfig } from './config'

export async function createDevServer(
  root: string,
  restartDevServer: () => Promise<void>
) {
  const config = await resolveConfig(root, 'serve', 'development')

  return createServer({
    root,
    plugins: [
      pluginIndexHtml(),
      pluginReact(),
      pluginConfig(config, restartDevServer)
    ]
  })
}
