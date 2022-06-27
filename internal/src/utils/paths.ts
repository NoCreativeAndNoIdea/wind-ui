import { resolve } from 'path'

export const projRoot = resolve(__dirname, '..', '..', '..')
export const pkgRoot = resolve(projRoot, 'packages')
export const compRoot = resolve(pkgRoot, 'components')
export const windRoot = resolve(pkgRoot, 'wind-ui')

/** `/dist` */
export const buildOutput = resolve(projRoot, 'dist')
/** `/dist/element-plus` */
export const windOutput = resolve(buildOutput, 'wind-ui')

export const projPackage = resolve(projRoot, 'package.json')
export const compPackage = resolve(compRoot, 'package.json')
export const windPackage = resolve(windRoot, 'package.json')
