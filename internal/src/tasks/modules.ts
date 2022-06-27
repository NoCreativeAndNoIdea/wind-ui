import {
  excludeFiles,
  generateExternal,
  pkgRoot,
  windRoot,
  writeBundles,
} from '../utils'
import { buildConfigEntries, target } from '../build-info'
import { WindUiAlias } from '../plugins/wind-ui-alias'
import { rollup } from 'rollup'
import glob from 'fast-glob'
import DefineOptions from 'unplugin-vue-define-options/vite'
import Vue from '@vitejs/plugin-vue'
import VueJsx from '@vitejs/plugin-vue-jsx'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import esbuild from 'rollup-plugin-esbuild'

export const buildModules = async () => {
  const input = excludeFiles(
    await glob('**/*.{js,ts,vue}', {
      cwd: pkgRoot,
      absolute: true,
      onlyFiles: true,
    })
  )

  const bundle = await rollup({
    input,
    plugins: [
      WindUiAlias(),
      DefineOptions(),
      Vue({
        isProduction: false,
      }),
      VueJsx(),
      nodeResolve({
        extensions: ['.mjs', '.js', '.json', '.ts'],
      }),
      commonjs(),
      esbuild({
        sourceMap: true,
        target,
        loaders: {
          '.vue': 'ts',
        },
      }),
    ],
    external: await generateExternal({ full: false }),
    treeshake: false,
  })

  await writeBundles(
    bundle,
    buildConfigEntries.map(([module, config]) => ({
      format: config.format,
      dir: config.output.path,
      exports: module === 'cjs' ? 'named' : undefined,
      preserveModules: true,
      preserveModulesRoot: windRoot,
      sourcemap: true,
      entryFileNames: `[name].${config.ext}`,
    }))
  )
}
