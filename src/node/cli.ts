import { cac } from 'cac'
import { resolve } from 'path'
import { createDevServer } from './dev'
import { build } from './build'
const version = require('../../package.json').version

const cli = cac('island').version(version).help()

cli
  .command('[root]', 'start dev server')
  .alias('dev')
  .action(async (root: string) => {
    root = root ? resolve(root) : process.cwd()
    const server = await createDevServer(root)
    await server.listen()
    server.printUrls()
  })

cli
  .command('build [root]', 'build for production')
  .action(async (root: string) => {
    try {
      root = root ? resolve(root) : process.cwd()
      await build(root)
    } catch (e) {
      console.error(e)
    }
  })

cli.parse()

// 调试 CLI:
// 1. 在 package.json 中声明 bin 字段
// 2. 通过 npm link 将命令 link 到全局
// 3. 执行 island dev 命令
