import { cac } from 'cac'
import { resolve } from 'path'
import { build } from './build'
import { preview } from './preview'
import { resolveConfig } from './config'
const version = require('../../package.json').version

const cli = cac('island').version(version).help()

cli
  .command('[root]', 'start dev server')
  .alias('dev')
  .action(async (root: string) => {
    root = root ? resolve(root) : process.cwd()

    const createServer = async () => {
      const { createDevServer } = await import('./dev.js')
      const server = await createDevServer(root, async () => {
        await server.close()
        await createServer()
      })
      await server.listen()
      server.printUrls()
    }

    await createServer()
  })

cli
  .command('build [root]', 'build for production')
  .action(async (root: string) => {
    try {
      root = root ? resolve(root) : process.cwd()
      const config = await resolveConfig(root, 'build', 'production')
      await build(root, config)
    } catch (e) {
      console.error(e)
    }
  })

cli
  .command('preview [root]', 'preview production build')
  .option('--port <port>', 'port to use for preview server')
  .action(async (root: string, { port }: { port: number }) => {
    try {
      root = resolve(root)
      await preview(root, { port })
    } catch (e) {
      console.log(e)
    }
  })

cli.parse()

// 调试 CLI:
// 1. 在 package.json 中声明 bin 字段
// 2. 通过 npm link 将命令 link 到全局
// 3. 执行 island dev 命令
