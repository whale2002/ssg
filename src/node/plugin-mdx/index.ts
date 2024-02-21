import { Plugin } from 'vite'
import { pluginMdxRollup } from './pluginMdxRollup'
import { pluginMdxHMR } from './pluginMdxHMR'
export async function pluginMdx(): Promise<Plugin[]> {
  return [await pluginMdxRollup(), pluginMdxHMR()]
}
