import { createServer } from 'vite'
import { pluginIndexHtml } from './plugins/indexHtml'
import pluginReact from '@vitejs/plugin-react' // 热更新是这个包实现的

export function createDevServer(root: string) {
  return createServer({
    root,
    plugins: [pluginIndexHtml(), pluginReact()]
  })
}
