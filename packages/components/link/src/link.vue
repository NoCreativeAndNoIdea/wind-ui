<script setup lang="ts">
import { DIcon } from '@wind-ui/components/icon'
import { useNamespace } from '@wind-ui/hooks'
import { linkProps, linkEmits } from './link'
defineOptions({
  name: 'DLink',
})

const props = defineProps(linkProps)
const emit = defineEmits(linkEmits)

const ns = useNamespace('link')

function handleClick(event: MouseEvent) {
  if (!props.disabled) emit('on-click', event)
}
</script>

<template>
  <a
    :class="[
      ns.b(),
      ns.m(type),
      ns.is('disabled', disabled),
      ns.is('underline', underline && !disabled),
    ]"
    :href="disabled || !href ? undefined : href"
    @click="handleClick"
  >
    <d-icon v-if="icon">
      <component :is="icon" />
    </d-icon>
    <span v-if="$slots.default" :class="ns.e('inner')">
      <slot />
    </span>

    <slot v-if="$slots.default" name="icon" />
  </a>
</template>
