<script lang="ts" setup>
import { computed } from 'vue'
import { useNamespace } from '@wind-ui/hooks'

import type { CSSProperties } from 'vue'

defineOptions({
  name: 'DFooter',
})
const props = defineProps({
  height: {
    type: String,
    default: null,
  },
})

const ns = useNamespace('footer')

const style = computed(
  () =>
    (props.height
      ? ns.cssVarBlock({ height: props.height })
      : {}) as CSSProperties
)
</script>
<template>
  <footer :class="ns.b()" :style="style">
    <slot />
  </footer>
</template>
