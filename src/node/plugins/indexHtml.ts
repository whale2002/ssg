import { readFile } from 'fs/promises'
import type { Plugin } from 'vite'
import { CLIENT_ENTRY_PATH, DEFAULT_HTML_PATH } from '../constants'

export function pluginIndexHtml(): Plugin {
  return {
    name: 'island:index-html',
    apply: 'serve',
    transformIndexHtml(html) {
      return {
        html,
        tags: [
          {
            tag: 'script',
            attrs: {
              type: 'module',
              src: `/@fs/${CLIENT_ENTRY_PATH}`
            },
            injectTo: 'body'
          }
        ]
      }
    },
    configureServer(server) {
      return () => {
        server.middlewares.use(async (req, res, next) => {
          // 读取默认的 index.html 文件
          let html = await readFile(DEFAULT_HTML_PATH, 'utf-8')

          try {
            html = await server.transformIndexHtml(
              req.url,
              html,
              req.originalUrl
            )
            // 响应
            res.statusCode = 200
            res.setHeader('Content-Type', 'text/html')
            res.end(html)
          } catch (e) {
            return next(e)
          }
        })
      }
    }
  }
}
