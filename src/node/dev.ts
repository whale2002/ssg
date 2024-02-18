import { createServer } from 'vite'
import { pluginIndexHtml } from './plugins/indexHtml'
import pluginReact from '@vitejs/plugin-react' // 热更新是这个包实现的
import { resolveConfig } from './config'

export async function createDevServer(root: string) {
  const config = await resolveConfig(root, 'serve', 'development')
  console.log(config)

  return createServer({
    root,
    plugins: [pluginIndexHtml(), pluginReact()]
  })
}
