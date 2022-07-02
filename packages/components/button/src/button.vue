<script setup lang="ts">
import { inject, useSlots, computed, ref, unref } from 'vue'
import { buttonGroupContextKey } from '@wind-ui/tokens'

import {
  useDisabled,
  useFormItem,
  useGlobalConfig,
  useNamespace,
  useSize,
} from '@wind-ui/hooks'
import { buttonProps, buttonEmits } from './button'
import { useButtonCustomStyle } from './button-custom'
import { DIcon } from '@wind-ui/components/icon'
import { Loading as LoadingIcon } from '@element-plus/icons-vue'
defineOptions({
  name: 'DButton',
})

const props = defineProps(buttonProps)
const emit = defineEmits(buttonEmits)
const slots = useSlots()
const { form } = useFormItem()

const buttonGroupContext = inject(buttonGroupContextKey, undefined)
const globalConfig = useGlobalConfig('button')

const _size = useSize(computed(() => buttonGroupContext?.size))
const _disabled = useDisabled()
const _ref = ref<HTMLButtonElement>()

const _type = computed(() => props.type || buttonGroupContext?.type || '')
const autoInsertSpace = computed(
  () => props.autoInsertSpace ?? globalConfig?.value?.autoInsertSpace ?? false
)

const shouldAddSpace = computed(() => {
  const defaultSlot = slots.default?.()
  if (autoInsertSpace.value && defaultSlot?.length === 1) {
    const [slot] = defaultSlot
    if (slot?.type === Text) {
      const text = slot.children as string
      return /^\p{Unified_Ideograph}{2}$/u.test(text.trim())
    }
  }
  return false
})

const buttonStyle = useButtonCustomStyle(props)

const handleClick = (evt: MouseEvent) => {
  if (props.nativeType === 'reset') {
    form?.resetFields()
  }
  emit('on-click', evt)
}

const ns = useNamespace('button')
const classes = [
  ns.b(),
  ns.m(unref(_type)),
  ns.m(unref(_size)),
  ns.is('disabled', unref(_disabled)),
]

defineExpose({
  ref: _ref,
  size: _size,
  type: _type,
  disabled: _disabled,
  shouldAddSpace,
})
</script>

<template>
  <button
    ref="_ref"
    :class="[
      ...classes,
      ns.is('loading', loading),
      ns.is('plain', plain),
      ns.is('round', round),
      ns.is('circle', circle),
      ns.is('text', text),
      ns.is('link', link),
      ns.is('has-bg', bg),
    ]"
    :aria-disabled="_disabled || loading"
    :disabled="_disabled || loading"
    :autofocus="autofocus"
    :style="buttonStyle"
    :type="nativeType"
    @click="handleClick"
  >
    <template v-if="loading">
      <slot v-if="$slots.loading" name="loading" />
      <d-icon v-else :class="ns.is('loading')">
        <component :is="LoadingIcon" />
      </d-icon>
    </template>
    <d-icon v-else-if="icon || $slots.icon">
      <component :is="icon" v-if="icon" />
      <slot v-else name="icon" />
    </d-icon>
    <span
      v-if="$slots.default"
      :class="{ [ns.em('test', 'expand')]: shouldAddSpace }"
    >
      <slot />
    </span>
  </button>
</template>
