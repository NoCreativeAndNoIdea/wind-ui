import consola from 'consola'
import * as process from 'process'

export const success = (message: string) => consola.success(message)
export const info = (message: string) => consola.info(message)
export const error = (message: string | Error) => consola.error(message)
export const trace = (message: string) => consola.trace(message)
export function errorAndExit(err: Error): never {
  error(err)
  process.exit(1)
}
