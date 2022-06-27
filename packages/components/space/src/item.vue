<script lang="ts">
import { computed } from '@vue/reactivity'
import { useNamespace } from '@wind-ui/hooks'
import { buildProps } from '@wind-ui/utils'
import { defineComponent } from 'vue'

const spaceItem = buildProps({
  prefixCls: {
    type: String,
    default: '',
  },
} as const)

export default defineComponent({
  props: spaceItem,

  setup(props) {
    const ns = useNamespace('space')
    const classes = computed(() => `${props.prefixCls || ns.b()}__item`)

    return {
      classes,
    }
  },
})
</script>

<template>
  <div :class="classes">
    <slot />
  </div>
</template>
