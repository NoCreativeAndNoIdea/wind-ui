<script lang="ts" setup>
import { inject, ref, computed, onBeforeMount, toRef } from 'vue'
import { scrollbarContextKey } from '@wind-ui/tokens'
import { useNamespace, useEventlistener } from '@wind-ui/hooks'
import { throwError } from '@wind-ui/utils'
import { thumpProps } from './thumb'
import { BAR_MAP, renderThumbStyle } from './util'
const COMPONENT_NAME = 'Thumb'
const props = defineProps(thumpProps)
const scrollbar = inject(scrollbarContextKey)
const ns = useNamespace('scrollbar')

if (!scrollbar) throwError(COMPONENT_NAME, 'can not inject scrollbar context')

const instance = ref<HTMLDivElement>()
const thumb = ref<HTMLDivElement>()

const thumbState = ref<Partial<Record<'X' | 'Y', number>>>({})
const visible = ref(false)

let cursorDown = false
let cursorLeave = false
const originalOnSelectStart:
  | ((this: GlobalEventHandlers, ev: Event) => any)
  | null = window ? document.onselectstart : null

const bar = computed(() => BAR_MAP[props.vertical ? 'vertical' : 'horizontal'])

const thumbStyle = computed(() =>
  renderThumbStyle({
    size: props.size,
    move: props.move,
    bar: bar.value,
  })
)

const offsetRatio = computed(
  () =>
    instance.value![bar.value.offset] ** 2 /
    scrollbar.wrapElement![bar.value.scrollSize] /
    (props.ratio || 1) /
    thumb.value![bar.value.offset]
)

const restoreOnselectstart = () => {
  if (document.onselectstart !== originalOnSelectStart) {
    document.onselectstart = originalOnSelectStart
  }
}

const mouseMoveDocumentHandler = (e: MouseEvent) => {
  if (!instance.value || !thumb.value) return
  if (cursorDown === false) return
  const prevPage = thumbState.value[bar.value.axis]
  if (!prevPage) return

  const offset =
    (instance.value.getBoundingClientRect()[bar.value.direction] -
      e[bar.value.client]) *
    -1

  const thumbClickPosition = thumb.value[bar.value.offset] - prevPage
  const thumbPositionPercentage =
    ((offset - thumbClickPosition) * 100 * offsetRatio.value) /
    instance.value[bar.value.offset]

  scrollbar.wrapElement[bar.value.scroll] =
    (thumbPositionPercentage * scrollbar.wrapElement[bar.value.scrollSize]) /
    100
}

const mouseUpDocumentHandler = () => {
  cursorDown = false
  thumbState.value[bar.value.axis] = 0
  document.removeEventListener('mousemove', mouseMoveDocumentHandler)
  document.removeEventListener('mouseup', mouseUpDocumentHandler)
  restoreOnselectstart()
  if (cursorLeave) visible.value = false
}

const startDrag = (e: MouseEvent) => {
  e.stopImmediatePropagation()
  cursorDown = true
  document.addEventListener('mousemove', mouseMoveDocumentHandler)
  document.addEventListener('mouseup', mouseUpDocumentHandler)
  document.onselectstart = () => false
}

const clickThumbHandler = (e: MouseEvent) => {
  e.stopPropagation()

  if (e.ctrlKey || [1, 2].includes(e.button)) return

  window.getSelection()?.removeAllRanges()
  startDrag(e)

  const el = e.currentTarget as HTMLDialogElement
  if (!el) return
  thumbState.value[bar.value.axis] =
    el[bar.value.offset] -
    (e[bar.value.client] - el.getBoundingClientRect()[bar.value.direction])
}

const clickTrackHandler = (e: MouseEvent) => {
  if (!thumb.value || !instance.value || !scrollbar.wrapElement) return

  const offset = Math.abs(
    (e.target as HTMLElement).getBoundingClientRect()[bar.value.direction] -
      e[bar.value.client]
  )

  const thumbHalf = thumb.value[bar.value.offset] / 2
  const thumbPositionPercentage =
    ((offset - thumbHalf) * 100 * offsetRatio.value) /
    instance.value[bar.value.offset]

  scrollbar.wrapElement[bar.value.scroll] =
    (thumbPositionPercentage * scrollbar.wrapElement[bar.value.scroll]) / 100
}

const mouseMoveScrollbarHandler = () => {
  cursorLeave = false
  visible.value = !!props.size
}

const mouseLeaveScrollbarHandler = () => {
  cursorLeave = true
  visible.value = cursorDown
}

onBeforeMount(() => {
  restoreOnselectstart()
  document.removeEventListener('mouseup', mouseUpDocumentHandler)
})

useEventlistener(
  'mousemove',
  mouseMoveScrollbarHandler,
  toRef(scrollbar, 'scrollbarElement')
)

useEventlistener(
  'mouseleave',
  mouseLeaveScrollbarHandler,
  toRef(scrollbar, 'scrollbarElement')
)
</script>

<template>
  <transition :name="ns.b('fade')">
    <div
      v-show="always || visible"
      ref="instance"
      :class="[ns.e('bar'), ns.is(bar.key)]"
      @mousedown="clickTrackHandler"
    >
      <div
        ref="thumb"
        :class="ns.e('thumb')"
        :style="thumbStyle"
        @mousedown="clickThumbHandler"
      />
    </div>
  </transition>
</template>
