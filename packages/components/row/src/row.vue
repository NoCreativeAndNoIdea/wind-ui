<script lang="ts" setup>
import { computed } from '@vue/reactivity'
import { useNamespace } from '@wind-ui/hooks'
import { rowContextKey } from '@wind-ui/tokens'
import type { CSSProperties } from 'vue'
import { provide } from 'vue'
import { rowProps } from './row'

defineOptions({
  name: 'DRow',
})
const props = defineProps(rowProps)
const ns = useNamespace('row')
const gutter = computed(() => props.gutter)

provide(rowContextKey, {
  gutter,
})

const style = computed(() => {
  const styles: CSSProperties = {}
  if (!props.gutter) {
    return styles
  }
  const px = `-${props.gutter / 2}px`
  styles.marginRight = px
  styles.marginLeft = px
  return styles
})
</script>

<template>
  <component
    :is="tag"
    :class="[
      ns.b(),
      ns.is(`justify-${props.justify}`, justify !== 'start'),
      ns.is(`align-${props.align}`, align !== 'top'),
    ]"
    :style="style"
  >
    <slot />
  </component>
</template>
