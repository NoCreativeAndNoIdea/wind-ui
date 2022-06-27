import { resolve } from 'path'
import { windOutput, success } from '@wind-ui/internal/src/utils'
import chalk from 'chalk'
import gulpSass from 'gulp-sass'
import dartSass from 'sass'
import autoprefixer from 'gulp-autoprefixer'
import cleanCss from 'gulp-clean-css'
import rename from 'gulp-rename'
import { src, dest, parallel, series } from 'gulp'

const distFolder = resolve(__dirname, 'dist')
const distBundle = resolve(windOutput, 'theme-chalk')

function buildThemeChalk() {
  const sass = gulpSass(dartSass)
  const noWindPrefixFile = /(index|base|display)/
  return src(resolve(__dirname, 'src/*.scss'))
    .pipe(sass.sync())
    .pipe(autoprefixer({ cascade: false }))
    .pipe(
      cleanCss({}, (details) => {
        success(
          `${chalk.cyan(details.name)}: ${chalk.yellow(
            details.stats.originalSize / 100
          )} KB  -> ${chalk.green(details.stats.minifiedSize / 1000)} kB`
        )
      })
    )
    .pipe(
      rename((path) => {
        if (!noWindPrefixFile.test(path.basename)) {
          path.basename = `wind-${path.basename}`
        }
      })
    )
    .pipe(dest(distFolder))
}

function buildDarkCssVars() {
  const sass = gulpSass(dartSass)
  return src(resolve(__dirname, 'src/dark/css-vars.scss'))
    .pipe(sass.sync())
    .pipe(autoprefixer({ cascade: false }))
    .pipe(
      cleanCss({}, (details) => {
        success(
          `${chalk.cyan(details.name)}: ${chalk.yellow(
            details.stats.originalSize / 1000
          )} KB -> ${chalk.green(details.stats.minifiedSize / 1000)} KB`
        )
      })
    )
    .pipe(dest(`${distFolder}/dark`))
}

export function copyThemeChalkBundle() {
  return src(`${distFolder}/**`).pipe(dest(distBundle))
}

export function copyThemeChalkSource() {
  return src(resolve(__dirname, 'src/**')).pipe(
    dest(resolve(distBundle, 'src'))
  )
}
export const build = parallel(
  copyThemeChalkSource,
  series(buildThemeChalk, buildDarkCssVars, copyThemeChalkBundle)
)

export default build
