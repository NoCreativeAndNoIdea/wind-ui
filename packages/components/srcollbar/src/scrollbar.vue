<script lang="ts" setup>
import {
  ref,
  computed,
  watch,
  provide,
  nextTick,
  onMounted,
  onUpdated,
  reactive,
} from 'vue'
import type { StyleValue, CSSProperties } from 'vue'
import {
  useNamespace,
  useEventlistener,
  useResizeObserver,
} from '@wind-ui/hooks'
import { addUnit, isObject, isNumber, debugWarn } from '@wind-ui/utils'
import { scrollbarContextKey } from '@wind-ui/tokens'
import { scrollbarProps, scrollbarEmits } from './scrollbar'
import { GAP } from './util'
import Bar from './bar.vue'
import type { BarInstance } from './bar'
defineOptions({
  name: 'DScrollbar',
})

const props = defineProps(scrollbarProps)
const emit = defineEmits(scrollbarEmits)

const ns = useNamespace('scrollbar')
let stopResizeObserver: (() => void) | undefined
let stopResizeListener: (() => void) | undefined

const scrollbar$ = ref<HTMLDivElement>()
const wrap$ = ref<HTMLDivElement>()
const resize$ = ref<HTMLDivElement>()

const sizeWidth = ref('0')
const sizeHeight = ref('0')
const barRef = ref<BarInstance>()
const ratioY = ref(1)
const ratioX = ref(1)
const SCOPE = 'DScrollbar'

const style = computed<StyleValue>(() => {
  const style: CSSProperties = {}
  if (props.height) style.height = addUnit(props.height)
  if (props.maxHeight) style.maxHeight = addUnit(props.height)
  return style
})

const handleScroll = () => {
  if (wrap$.value) {
    barRef.value?.handleScroll(wrap$.value)

    emit('on-scroll', {
      scrollTop: wrap$.value.scrollTop,
      scrollLeft: wrap$.value.scrollLeft,
    })
  }
}

function scrollTo(xCord: number, yCord?: number): void
function scrollTo(options: ScrollToOptions): void
function scrollTo(arg: unknown, arg1?: unknown) {
  if (isObject(arg)) {
    wrap$.value!.scrollTo(arg)
  } else if (isNumber(arg1) && isNumber(arg1)) {
    wrap$.value!.scrollTo(arg1, arg1)
  }
}

const setScrollTop = (value: number) => {
  if (!isNumber(value)) {
    debugWarn(SCOPE, 'value muse be a number')
    return
  }

  wrap$.value!.scrollTop = value
}

const setScrollLeft = (value: number) => {
  if (!isNumber(value)) {
    debugWarn(SCOPE, 'value muse be a number')
    return
  }

  wrap$.value!.scrollLeft = value
}

const update = () => {
  if (!wrap$.value) return
  const offsetHeight = wrap$.value.offsetHeight - GAP
  const offsetWidth = wrap$.value.offsetWidth - GAP

  const originalHeight = offsetHeight ** 2 / wrap$.value.scrollHeight
  const originalWidth = offsetWidth ** 2 / wrap$.value.scrollWidth
  const height = Math.max(originalHeight, props.minSize)
  const width = Math.max(originalWidth, props.minSize)

  ratioY.value =
    originalHeight /
    (offsetHeight - originalHeight) /
    (height / (offsetHeight - height))

  ratioX.value =
    originalWidth /
    (offsetWidth - originalWidth) /
    (width / (offsetWidth - width))

  sizeHeight.value = height + GAP < offsetHeight ? `${height}px` : ''
  sizeWidth.value = width + GAP < offsetWidth ? `${width}px` : ''
}

watch(
  () => props.noresize,
  (noresize: boolean) => {
    if (noresize) {
      stopResizeObserver?.()
      stopResizeListener?.()
    } else {
      ;({ stop: stopResizeObserver } = useResizeObserver(resize$, update))
      stopResizeListener = useEventlistener('resize', update)
    }
  },
  {
    immediate: true,
  }
)

watch(
  () => [props.maxHeight, props.height],
  () => {
    if (!props.native) {
      nextTick(() => {
        update()
        if (wrap$.value) {
          barRef.value?.handleScroll(wrap$.value)
        }
      })
    }
  }
)

provide(
  scrollbarContextKey,
  reactive({
    scrollbarElement: scrollbar$,
    wrapElement: wrap$,
  })
)

onMounted(() => {
  if (!props.native) nextTick(() => update())
})

onUpdated(() => update())

defineExpose({
  wrap$,
  update,
  scrollTo,
  setScrollTop,
  setScrollLeft,
  handleScroll,
})
</script>

<template>
  <div ref="scrollbar$" :class="ns.b()">
    <div
      ref="wrap$"
      :class="[
        wrapClass,
        ns.e('wrap'),
        { [ns.em('wrap', 'hidden-default')]: !native },
      ]"
      :style="style"
      @scroll="handleScroll"
    >
      <component
        :is="tag"
        ref="resize$"
        :class="[ns.e('view'), viewClass]"
        :style="viewStyle"
      >
        <slot />
      </component>
    </div>
    <template v-if="!native">
      <bar
        ref="barRef"
        :height="sizeHeight"
        :width="sizeWidth"
        :always="always"
        :ratio-x="ratioX"
        :ratio-y="ratioY"
      />
    </template>
  </div>
</template>
