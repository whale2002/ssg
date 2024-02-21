import { Plugin } from 'vite'

export function pluginMdxHMR(): Plugin {
  return {
    name: 'vite-plugin-mdx-hmr',
    apply: 'serve',
    handleHotUpdate(ctx) {
      if (/\.mdx?/.test(ctx.file)) {
        ctx.server.ws.send({
          type: 'custom',
          event: 'mdx-changed',
          data: {
            filePath: ctx.file
          }
        })
      }
    }
  }
}
