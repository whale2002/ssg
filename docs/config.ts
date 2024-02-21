import { defineConfig } from '../dist'

export default defineConfig({
  title: 'ssg site',
  themeConfig: {
    nav: [
      { text: '主页', link: '/' },
      { text: '指南', link: '/guide/' }
    ]
  },
  vite: {}
})
