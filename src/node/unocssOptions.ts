import { VitePluginConfig } from 'unocss/vite'
import { presetAttributify, presetIcons, presetWind } from 'unocss'

const options: VitePluginConfig = {
  presets: [presetAttributify(), presetWind(), presetIcons()],
  shortcuts: {
    'flex-center': 'flex justify-center items-center'
  },
  theme: {
    colors: {
      brandLight: 'var(--island-c-brand-light)',
      brandDark: 'var(--island-c-brand-dark)',
      brand: 'var(--island-c-brand)',
      text: {
        1: 'var(--island-c-text-1)',
        2: 'var(--island-c-text-2)',
        3: 'var(--island-c-text-3)',
        4: 'var(--island-c-text-4)'
      },
      divider: {
        default: 'var(--island-c-divider)',
        light: 'var(--island-c-divider-light)',
        dark: 'var(--island-c-divider-dark)'
      },
      gray: {
        light: {
          1: 'var(--island-c-gray-light-1)',
          2: 'var(--island-c-gray-light-2)',
          3: 'var(--island-c-gray-light-3)',
          4: 'var(--island-c-gray-light-4)'
        }
      },
      bg: {
        default: 'var(--island-c-bg)',
        soft: 'var(--island-c-bg-soft)',
        mute: 'var(--island-c-bg-mute)'
      }
    }
  }
}

export default options