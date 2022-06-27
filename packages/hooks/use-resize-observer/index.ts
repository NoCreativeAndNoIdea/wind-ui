import type { MaybeElementRef } from '@wind-ui/utils'
import { tryOnScopeDispose } from '@wind-ui/utils'
import { unrefElement } from '@wind-ui/utils'
import { watch } from 'vue'

export interface ResizeObserverSize {
  readonly inlineSize: number
  readonly blockSize: number
}

export interface ResizeObserverEntry {
  readonly target: Element
  readonly contentRect: DOMRectReadOnly
  readonly borderboxSize?: ReadonlyArray<ResizeObserverSize>
  readonly contentBoxSize?: ReadonlyArray<ResizeObserverSize>
  readonly devicePixelContentBoxSize?: ReadonlyArray<ResizeObserverSize>
}

export type ResizeObserverCallback = (
  entries: ReadonlyArray<ResizeObserverEntry>,
  observer: ResizeObserver
) => void

export interface ResizeObserverOptions {
  window?: Window
  box?: 'content-box' | 'border-box'
}

export const useResizeObserver = (
  target: MaybeElementRef,
  callback: ResizeObserverCallback,
  options: ResizeObserverOptions = {}
) => {
  const { window: _window = window, ...observerOptions } = options
  let observer: ResizeObserver | undefined

  const cleanup = () => {
    if (observer) {
      observer.disconnect()
      observer = undefined
    }
  }

  const stopWatch = watch(
    () => unrefElement(target),
    (el) => {
      cleanup()

      if (_window && el) {
        observer = new window.ResizeObserver(callback)
        observer!.observe(el, observerOptions)
      }
    },
    { immediate: true, flush: 'post' }
  )

  const stop = () => {
    cleanup()
    stopWatch()
  }

  tryOnScopeDispose(stop)

  return {
    stop,
  }
}
