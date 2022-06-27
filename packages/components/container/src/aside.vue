<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { computed } from 'vue'
import { useNamespace } from '@wind-ui/hooks'
defineOptions({
  name: 'DAside',
})

const props = defineProps({
  width: {
    type: String,
    default: null,
  },
})
const ns = useNamespace('aside')
const style = computed(
  () =>
    (props.width ? ns.cssVarBlock({ width: props.width }) : {}) as CSSProperties
)
</script>

<template>
  <aside :class="[ns.b()]" :style="style">
    <slot />
  </aside>
</template>
