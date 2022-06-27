<script lang="ts" setup>
import { useSlots, computed } from 'vue'
import type { Component, VNode } from 'vue'
import { useNamespace } from '@wind-ui/hooks'
defineOptions({
  name: 'DContainer',
})
const props = defineProps({
  direction: {
    type: String,
  },
})
const slots = useSlots()
const ns = useNamespace('container')

const isVertical = computed(() => {
  if (props.direction === 'vertical') {
    return true
  } else if (props.direction === 'horizontal') {
    return false
  }

  if (slots && slots.default) {
    const vNodes: VNode[] = slots.default()
    return vNodes.some((vNode) => {
      const tag = (vNode.type as Component).name
      return tag === 'DHeader' || tag === 'DFooter'
    })
  } else {
    return false
  }
})
</script>

<template>
  <section :class="[ns.b(), ns.is('vertical', isVertical)]">
    <slot />
  </section>
</template>

<style></style>
