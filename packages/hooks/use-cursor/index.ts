import type { Fn } from '@wind-ui/utils'
import type { ShallowRef } from 'vue'
import { ref } from 'vue'

export function useCursor(
  input: ShallowRef<HTMLInputElement | undefined>
): [Fn, Fn] {
  const selectionRef = ref<{
    selectionStart?: number
    selectionEnd?: number
    value?: string
    beforeText?: string
    afterText?: string
  }>()

  // eslint-disable-next-line consistent-return
  function recordCursor() {
    if (!input.value) return undefined

    const { selectionStart, selectionEnd, value } = input.value

    if (!selectionStart || !selectionEnd) return undefined

    const beforeText = value.slice(0, Math.max(0, selectionStart))
    const afterText = value.slice(Math.max(0, selectionEnd))

    selectionRef.value = {
      selectionStart,
      selectionEnd,
      value,
      beforeText,
      afterText,
    }
  }

  // eslint-disable-next-line consistent-return
  function setCursor() {
    if (input.value === undefined || selectionRef.value === undefined) return

    const { value } = input.value
    const { beforeText, afterText, selectionStart } = selectionRef.value

    if (
      beforeText === undefined ||
      afterText === undefined ||
      selectionStart === undefined
    )
      return

    let startPos = value.length

    if (value.endsWith(afterText)) {
      startPos = value.length - afterText.length
    } else if (value.startsWith(beforeText)) {
      startPos = beforeText.length
    } else {
      const beforeLastChar = beforeText[selectionStart - 1]
      const newIndex = value.indexOf(beforeLastChar, selectionStart - 1)
      if (newIndex !== -1) {
        startPos = newIndex + 1
      }
    }

    input.value.setSelectionRange(startPos, startPos)
  }

  return [recordCursor, setCursor]
}
