import 'undertaker'
import type { TaskFunction } from 'gulp'
import { parallel, series } from 'gulp'
import { join, resolve } from 'path'
import { copyFile } from 'fs/promises'
import {
  run,
  runTask,
  withTaskName,
  windOutput,
  windPackage,
  projRoot,
  buildOutput,
} from './src'
import type { Module } from './src/build-info'
import { mkdir } from 'fs/promises'
import { copy } from 'fs-extra'
import { buildConfig } from './src/build-info'

export const copyFiles = () =>
  Promise.all([
    copyFile(windPackage, join(windOutput, 'package.json')),
    copyFile(resolve(projRoot, 'README.md'), resolve(windOutput, 'README.md')),
    copyFile(
      resolve(projRoot, 'global.d.ts'),
      resolve(windOutput, 'global.d.ts')
    ),
  ])

export const copyTypesDefinitions: TaskFunction = (done) => {
  const src = resolve(buildOutput, 'types', 'packages')
  const copyTypes = (module: Module) =>
    withTaskName(`copyTypes:${module}`, async () => {
      await copy(src, buildConfig[module].output.path, {
        recursive: true,
      })
    })

  return parallel(copyTypes('esm'), copyTypes('cjs'))(done)
}

export const copyFullStyle = async () => {
  await mkdir(resolve(windOutput, 'dist'), { recursive: true })
  await copyFile(
    resolve(windOutput, 'theme-chalk/index.css'),
    resolve(windOutput, 'dist/index.css')
  )
}

export default series(
  withTaskName('clean', () => run('pnpm run clean')),
  withTaskName('createOutput', () => mkdir(windOutput, { recursive: true })),
  parallel(
    runTask('buildModules'),
    runTask('buildFullBundle'),
    runTask('generateTypesDefinitions'),
    series(
      withTaskName('buildThemeChalk', () =>
        run('pnpm run -C packages/theme-chalk build')
      ),
      copyFullStyle
    )
  ),
  parallel(copyTypesDefinitions, copyFiles)
)

export * from './src'
