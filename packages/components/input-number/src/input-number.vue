<script setup lang="ts">
import { DIcon } from '@wind-ui/components/icon'
import { DInput } from '@wind-ui/components/input'
import {
  ArrowDown,
  ArrowUp,
  Minus as MinusIcon,
  Plus,
} from '@element-plus/icons-vue'
import type { InputInstance } from '@wind-ui/components/input'
import { useDisabled, useFormItem, useNamespace, useSize } from '@wind-ui/hooks'
import { debugWarn, isNumber, isString, isUndefined } from '@wind-ui/utils'
import { isNil } from 'lodash-unified'
import { RepeatClick } from '@wind-ui/directives'
import {
  computed,
  onMounted,
  onUpdated,
  reactive,
  ref,
  watch,
  withDirectives,
} from 'vue'
import type { InputNumberData } from './inputNumberType'
import { inputNumberEmits, inputNumberProp } from './inputNumberType'

defineOptions({
  name: 'DInputNumber',
})

const vRepeatClick = RepeatClick

const props = defineProps(inputNumberProp)
const emit = defineEmits(inputNumberEmits)

const ns = useNamespace('input-number')
const input = ref<InputInstance>()

const data = reactive<InputNumberData>({
  currentValue: props.modelValue,
  userInput: null,
})

const { formItem } = useFormItem()

const controlsAtRight = computed(
  () => props.controls && props.controlsPosition === 'right'
)

const inputNumberSize = useSize()
const inputNumberDisabled = useDisabled()

const displayValue = computed(() => {
  if (data.userInput !== null) {
    return data.userInput
  }
  let value: number | string | undefined | null = data.currentValue
  if (isNil(value)) return ''
  if (isNumber(value)) {
    if (Number.isNaN(value)) return ''
    if (!isUndefined(props.precision)) {
      value = value.toFixed(props.precision)
    }
  }
  return value
})

const getPrecision = (value: number | null | undefined) => {
  if (isNil(value)) return 0
  const valueString = value.toString()
  const dotPosition = valueString.indexOf('.')
  let precision = 0
  if (dotPosition !== -1) {
    precision = valueString.length - dotPosition - 1
  }
  return precision
}

const numPrecision = computed(() => {
  const stepPrecision = getPrecision(props.step)
  if (!isUndefined(props.precision)) {
    if (stepPrecision > props.precision) {
      debugWarn(
        'InputNumber',
        'precision should not be less than the decimal places of step'
      )
    }
    return props.precision
  } else {
    return Math.max(getPrecision(props.modelValue), stepPrecision)
  }
})

const toPrecision = (num: number, pre?: number) => {
  if (isUndefined(pre)) pre = numPrecision.value
  if (pre === 0) return Math.round(num)
  let snum = String(num)
  const pointPos = snum.indexOf('.')
  if (pointPos === -1) return num
  const nums = snum.replace('.', '').split('')
  const datum = nums[pointPos + pre]
  if (!datum) return num
  const { length } = snum
  if (snum.charAt(length - 1) === '5') {
    snum = `${snum.slice(0, Math.max(0, length - 1))}6`
  }
  return Number.parseFloat(Number(snum).toFixed(pre))
}

const ensurePrecision = (val: number, coefficient: 1 | -1 = 1) => {
  if (!isNumber(val)) return data.currentValue
  return toPrecision(val + props.step * coefficient)
}

const minDisabled = computed(
  () =>
    isNumber(props.modelValue) &&
    ensurePrecision(props.modelValue, -1)! < props.min
)

const maxDisabled = computed(
  () =>
    isNumber(props.modelValue) && ensurePrecision(props.modelValue)! > props.max
)

const verifyValue = (
  value: number | string | null | undefined,
  update?: boolean
): number | null | undefined => {
  const { max, min, step, precision, stepStrictly, valueOnClear } = props
  let newVal = Number(value)
  if (isNil(value) || Number.isNaN(newVal)) return null
  if (value === '') {
    if (valueOnClear === null) return null
    newVal = isString(valueOnClear) ? { min, max }[valueOnClear] : valueOnClear
  }
  if (stepStrictly) {
    newVal = Math.round(newVal / step) * step
  }
  if (!isUndefined(precision)) {
    newVal = toPrecision(newVal, precision)
  }
  if (newVal > max || newVal < min) {
    newVal = newVal > max ? max : min
    update && emit('update:modelValue', newVal)
  }

  return newVal
}

const setCurrentValue = (value: number | string | null | undefined) => {
  const oldValue = data.currentValue
  const newVal = verifyValue(value)
  if (oldValue === newVal) return
  data.userInput = null
  emit('update:modelValue', newVal!)
  emit('input', newVal!)
  emit('change', newVal!, oldValue!)
  formItem?.validate?.('change').catch((err) => debugWarn(err))
  data.currentValue = newVal
}

const increase = () => {
  if (inputNumberDisabled.value || maxDisabled.value) return
  const value = props.modelValue || 0
  const newVal = ensurePrecision(value)
  setCurrentValue(newVal)
}

const decrease = () => {
  if (inputNumberDisabled.value || minDisabled.value) return
  const value = props.modelValue || 0
  const newVal = ensurePrecision(value, -1)
  setCurrentValue(newVal)
}

const handleInput = (values: string) => (data.userInput = values)
const handleInputChange = (values: string) => {
  const newVal = values !== '' ? Number(values) : ''
  if ((isNumber(newVal) && !Number.isNaN(newVal)) || values === '') {
    setCurrentValue(newVal)
  }
  data.userInput = null
}

const focus = () => input?.value?.focus?.()
const blur = () => input?.value?.blur?.()

const handleFocus = (event: MouseEvent | FocusEvent) => {
  emit('focus', event)
}
const handleBlur = (event: MouseEvent | FocusEvent) => {
  emit('blur', event)
}

watch(
  () => props.modelValue,
  (value) => {
    data.currentValue = verifyValue(value, true)
    data.userInput = null
  },
  { immediate: true }
)

onMounted(() => {
  const { min, max, modelValue } = props
  const innerInput = input.value?.input as HTMLInputElement
  innerInput.setAttribute('role', 'spinbutton')
  if (Number.isFinite(max)) {
    innerInput.setAttribute('aria-valuemax', String(max))
  } else {
    innerInput.removeAttribute('aria-valuemax')
  }

  if (Number.isFinite(min)) {
    innerInput.setAttribute('aria-valuemin', String(min))
  } else {
    innerInput.removeAttribute('aria-valuemin')
  }

  innerInput.setAttribute('aria-valuenow', String(data.currentValue))
  innerInput.setAttribute('aria-disabled', String(inputNumberDisabled.value))

  if (!isNumber(modelValue) && modelValue) {
    let val: number | null = Number(modelValue)
    if (Number.isNaN(val)) {
      val = null
    }
    emit('update:modelValue', val!)
  }
})

onUpdated(() => {
  const innerInput = input.value?.input
  innerInput?.setAttribute('aria-valuenow', `${data.currentValue}`)
})

defineExpose({
  focus,
  blur,
})
</script>

<template>
  <div
    :class="[
      ns.b(),
      ns.m(inputNumberSize),
      ns.is('disabled', inputNumberDisabled),
      ns.is('without-controls', !controls),
      ns.is('controls-right', controlsAtRight),
    ]"
    @dragstart.prevent
  >
    <span
      v-if="controls"
      v-repeat-click="decrease"
      :class="[ns.e('decrease'), ns.is('disabled', minDisabled)]"
      role="button"
      aria-label="decrease"
      @keydown.enter="decrease"
    >
      <d-icon>
        <arrow-down v-if="controlsAtRight" />
        <minus-icon v-else />
      </d-icon>
    </span>
    <span
      v-if="controls"
      v-repeat-click="increase"
      role="button"
      aria-label="increase"
      :class="[ns.e('increase'), ns.is('disabled', maxDisabled)]"
      @keydown.enter="increase"
    >
      <d-icon>
        <arrow-up v-if="controlsAtRight" />
        <plus v-else />
      </d-icon>
    </span>
    <d-input
      :id="id"
      ref="input"
      type="number"
      :step="step"
      :model-value="displayValue"
      :placeholder="placeholder"
      :disabled="inputNumberDisabled"
      :size="inputNumberSize"
      :max="max"
      :min="min"
      :name="name"
      :label="label"
      :validate-event="false"
      @keydown.up.prevent="increase"
      @keydown.down.prevent="decrease"
      @blur="handleBlur"
      @focus="handleFocus"
      @input="handleInput"
      @change="handleInputChange"
    />
  </div>
</template>
