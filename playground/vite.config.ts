import { defineConfig } from 'vite'
import { resolve } from 'path'
import Vue from '@vitejs/plugin-vue'
import VueJsx from '@vitejs/plugin-vue-jsx'
import esbuild from 'rollup-plugin-esbuild'
import DefineOptions from 'unplugin-vue-define-options/vite'
import Components from 'unplugin-vue-components/vite'
import Inspect from 'vite-plugin-inspect'

const esbuildPlugin = () => ({
  ...esbuild({
    target: 'chrome64',
    include: /\.vue$/,
    loaders: {
      '.vue': 'js',
    },
  }),
  enforce: 'post',
})

export default () =>
  defineConfig({
    resolve: {
      alias: [
        {
          find: /^@no_idea\/wind-ui(\/(es|lib))?$/,
          replacement: resolve(__dirname, '../packages/wind-ui', 'index.ts'),
        },
        {
          find: /^@no_idea\/wind-ui\/(es|lib)\/(.*)$/,
          replacement: `../package.json/$2`,
        },
      ],
    },
    server: {
      host: true,
      https: false,
    },
    plugins: [
      Vue(),
      VueJsx(),
      esbuildPlugin(),
      DefineOptions(),
      Components({
        dts: false,
        resolvers: [
          (componentName: string) => {
            if (componentName.startsWith('D'))
              return {
                name: componentName,
                from: `@no_idea/wind-ui`,
              }
            return null
          },
        ],
      }),
      Inspect(),
    ],
    optimizeDeps: {
      include: ['vue', '@vue/shared'],
    },
    esbuild: {
      target: 'chrome64',
    },
  })
