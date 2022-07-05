type EventElement = HTMLElement | Document | Window | Element

export const onEvent = (
  element: EventElement,
  event: string,
  handler: EventListenerOrEventListenerObject,
  useCapture = false
) => {
  if (element && event && handler) {
    element?.addEventListener(event, handler, useCapture)
  }
}

export const offEvent = (
  element: EventElement,
  event: string,
  handler: EventListenerOrEventListenerObject,
  useCapture = false
) => {
  if (element && event && handler) {
    element?.removeEventListener(event, handler, useCapture)
  }
}

export const onceEvent = (
  el: EventElement,
  event: string,
  fn: EventListener
) => {
  const listener = function (this: any, ...args: any) {
    if (fn) {
      fn.apply(this, args)
    }
    offEvent(el, event, listener)
  }
  onEvent(el, event, listener)
}
