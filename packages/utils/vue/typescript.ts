import type {
  AppContext,
  ComponentPublicInstance,
  ComputedRef,
  Plugin,
} from 'vue'
import { unref } from 'vue'
import type { MaybeRef } from './types'

export type SFCWithInstall<T> = T & Plugin
export type SFCInstallWithContext<T> = SFCWithInstall<T> & {
  _context: AppContext | null
}

export type VueInstance = ComponentPublicInstance

export type ElementRef =
  | HTMLElement
  | SVGAElement
  | VueInstance
  | undefined
  | null

export type MaybeElementRef = MaybeRef<ElementRef> | ComputedRef<ElementRef>

export function unrefElement(
  elRef: MaybeElementRef
): HTMLElement | SVGAElement | undefined {
  const plain = unref(elRef)
  return (plain as VueInstance)?.$el ?? plain
}
