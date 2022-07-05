import { onEvent, onceEvent } from '@wind-ui/utils'
import type { DirectiveBinding, ObjectDirective } from 'vue'

export default {
  beforeMount(el: HTMLElement, binding: DirectiveBinding) {
    let interval: ReturnType<typeof setInterval> | null = null

    let startTime: number
    const handler = () => binding.value && binding.value()
    const clear = () => {
      if (Date.now() - startTime < 100) {
        handler()
      }
      clearInterval(interval!)
      interval = null
    }

    const eventHandler = (el: Event) => {
      if ((el as MouseEvent).button !== 0) return
      startTime = Date.now()
      onceEvent(document as any, 'mouseup', clear)
      interval && clearInterval(interval)
      interval = setInterval(handler, 100)
    }

    onEvent(el, 'mousedown', eventHandler)
  },
} as ObjectDirective
