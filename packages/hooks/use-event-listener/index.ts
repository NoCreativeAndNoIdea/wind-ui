import { tryOnScopeDispose } from '@wind-ui/utils'
import type { MaybeRef } from '@wind-ui/utils'
import { unref, watch } from 'vue'

export type EventTarget = Window | Document | Element

export const useEventlistener = (
  event: string,
  listener: (e: Event) => void,
  target: MaybeRef<EventTarget> = window,
  options?: boolean | AddEventListenerOptions
) => {
  const noop = () => {}

  let cleanup = noop

  const stopWatch = watch(
    () => unref(target),
    (el) => {
      cleanup()
      if (!el) return

      el.addEventListener(event, listener, options)

      cleanup = () => {
        el.removeEventListener(event, listener, options)
      }
    },
    {
      immediate: true,
      flush: 'post',
    }
  )

  const stop = () => {
    stopWatch()
    cleanup()
  }

  tryOnScopeDispose(stop)

  return stop
}
