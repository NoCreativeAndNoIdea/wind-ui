import { defineConfig } from 'vitepress'

const nav = () => [
  { text: 'Blogs', link: '/blog/about', activeMatch: '/blog/' },
  { text: 'WindUi', link: '/wind/started', activeMatch: '/wind/' },
]

export default defineConfig({
  title: 'Jixiaoqi Blog',
  description: '一个没有梦想的站点!',

  lastUpdated: true,

  themeConfig: {
    nav: nav(),

    socialLinks: [{ icon: 'github', link: 'https://github.com/' }],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2022-present Jixiaoqi',
    },
  },
})
