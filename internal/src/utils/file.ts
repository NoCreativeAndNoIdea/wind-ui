import findWorkspacePackages from '@pnpm/find-workspace-packages'
import { writeFile } from 'fs/promises'
import { projRoot } from './paths'
import type { Module } from '../build-info'
import { buildConfig } from '../build-info'

export const writeJson = (path: string, data: any, spaces = 0) =>
  writeFile(path, JSON.stringify(data, undefined, spaces), 'utf-8')

import type { ProjectManifest } from '@pnpm/types'

export const getWorkspacePackages = () => findWorkspacePackages(projRoot)
export const getWorkspaceNames = async (dir = projRoot) => {
  const pkgs = await findWorkspacePackages(projRoot)
  return pkgs
    .filter((pkg) => pkg.dir.startsWith(dir))
    .map((pkg) => pkg.manifest.name)
    .filter((name): name is string => !!name)
}

export const getPackageManifest = (pkgPath: string) =>
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require(pkgPath) as ProjectManifest

export const getPackageDependencies = (
  pkgPath: string
): Record<'dependencies' | 'peerDependencies', string[]> => {
  const manifest = getPackageManifest(pkgPath)
  const { dependencies = {}, peerDependencies = {} } = manifest

  return {
    dependencies: Object.keys(dependencies),
    peerDependencies: Object.keys(peerDependencies),
  }
}

export const excludeFiles = (files: string[]) => {
  const excludes = ['node_modules', 'test', 'mock', 'gulpfile', 'dist']
  return files.filter(
    (path) => !excludes.some((exclude) => path.includes(exclude))
  )
}

/** Used for type generator */
export const pathRewriter = (module: Module) => {
  const config = buildConfig[module]

  return (id: string) => {
    id = id.replaceAll(`@wind-ui/theme-chalk`, `@no_idea/wind-ui/theme-chalk`)
    id = id.replaceAll(`@wind-ui/`, `@no_idea/${config.bundle.path}/`)
    return id
  }
}
