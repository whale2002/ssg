import { resolve } from 'path'
import fs from 'fs-extra'
import { loadConfigFromFile } from 'vite'
import { UserConfig } from '../shared/types'

type RowConfig =
  | UserConfig
  | Promise<UserConfig>
  | (() => UserConfig | Promise<UserConfig>)

function getConfigPath(root: string) {
  try {
    const supportedConfigs = ['config.js', 'config.ts']
    const configPath = supportedConfigs
      .map((file) => resolve(root, file))
      .find(fs.pathExistsSync)

    return configPath
  } catch (e) {
    console.error('fail to load user config', e)
    throw e
  }
}

export async function resolveConfig(
  root: string,
  command: 'serve' | 'build',
  mode: 'development' | 'production'
) {
  const configPath = getConfigPath(root)

  const result = await loadConfigFromFile({ command, mode }, configPath, root)

  if (result) {
    const { config: rawConfig = {} as RowConfig } = result

    const userConfig = await (typeof rawConfig === 'function'
      ? rawConfig()
      : rawConfig)

    return [configPath, userConfig] as const
  }
}
