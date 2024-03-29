import type { Plugin } from 'vite'
import { normalizePath } from 'vite'
import { relative } from 'path'
import { SiteConfig } from 'shared/types/index'
import { PACKAGE_ROOT } from 'node/constants'
import { join } from 'path'
import sirv from 'sirv'
import fs from 'fs-extra'

const SITE_DATA_ID = 'island:site-data'

export function pluginConfig(
  config: SiteConfig,
  restartDevServer?: () => Promise<void>
): Plugin {
  return {
    name: 'island:config',
    configureServer(server) {
      const publicDir = join(config.root, 'public')
      if (fs.pathExistsSync(publicDir)) {
        server.middlewares.use(sirv(publicDir))
      }
    },
    resolveId(id) {
      if (id === SITE_DATA_ID) {
        return '\0' + SITE_DATA_ID
      }
    },
    load(id) {
      if (id === '\0' + SITE_DATA_ID) {
        return `export default ${JSON.stringify(config.siteData)}`
      }
    },
    async handleHotUpdate(ctx) {
      const customWatchedFiles = [normalizePath(config.configPath)]
      const include = (id: string) =>
        customWatchedFiles.some((file) => id.includes(file))

      if (include(ctx.file)) {
        console.log(
          `\n${relative(config.root, ctx.file)} changed, restarting server...`
        )
        // 重点: 重启 Dev Server
        await restartDevServer()
      }
    },
    config() {
      return {
        root: PACKAGE_ROOT
      }
    }
  }
}
