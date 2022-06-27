<script lang="ts" setup>
import { useNamespace } from '@wind-ui/hooks'
import { buttonGroupContextKey } from '@wind-ui/tokens'
import { provide, reactive, toRef } from 'vue'
import { buttonGroupProps } from './button-group'
defineOptions({
  name: 'DButtonGroup',
})

const props = defineProps(buttonGroupProps)
provide(
  buttonGroupContextKey,
  reactive({
    size: toRef(props, 'size'),
    type: toRef(props, 'type'),
  })
)
const ns = useNamespace('button')
</script>

<template>
  <div :class="`${ns.b('group')}`">
    <slot />
  </div>
</template>
