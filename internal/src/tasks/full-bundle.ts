import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import Vue from '@vitejs/plugin-vue'
import VueJsx from '@vitejs/plugin-vue-jsx'
import { parallel } from 'gulp'
import { resolve } from 'path'
import type { Plugin } from 'rollup'
import { rollup } from 'rollup'
import esbuild, { minify as minifyPlugin } from 'rollup-plugin-esbuild'
import DefineOptions from 'unplugin-vue-define-options/vite'
import { target } from '../build-info'
import {
  formatBundleFilename,
  generateExternal,
  windOutput,
  windRoot,
  withTaskName,
  writeBundles,
} from '../utils'

const banner = `/*! Wind Ui v0.0.1 */\n`

async function buildFullEntry(minify: boolean) {
  const plugins: Plugin[] = [
    DefineOptions(),
    Vue({
      isProduction: true,
    }),
    VueJsx(),
    nodeResolve({
      extensions: ['.mjs', '.js', '.json', '.ts'],
    }),
    commonjs(),
    esbuild({
      exclude: [],
      sourceMap: minify,
      target,
      loaders: {
        '.vue': 'ts',
      },
      define: {
        'process.env.NODE_ENV': JSON.stringify('production'),
      },
      treeShaking: true,
      legalComments: 'eof',
    }),
  ]
  if (minify) {
    plugins.push(minifyPlugin({ sourceMap: true }))
  }

  const bundle = await rollup({
    input: resolve(windRoot, 'index.ts'),
    plugins,
    external: await generateExternal({ full: true }),
    treeshake: true,
  })
  await writeBundles(bundle, [
    {
      format: 'esm',
      file: resolve(
        windOutput,
        'dist',
        formatBundleFilename('index.full', minify, 'mjs')
      ),
      sourcemap: minify,
      banner,
    },
    {
      format: 'umd',
      file: resolve(
        windOutput,
        'dist',
        formatBundleFilename('index.full', minify, 'js')
      ),
      exports: 'named',
      name: 'WindUi',
      globals: {
        vue: 'Vue',
      },
      sourcemap: minify,
      banner,
    },
  ])
}

export const buildFull = (minify: boolean) => async () =>
  Promise.all([buildFullEntry(minify)])

export const buildFullBundle = parallel(
  withTaskName('buildFullMinified', buildFull(true)),
  withTaskName('buildFull', buildFull(false))
)
