<script setup lang="ts">
import {
  CircleClose,
  Hide as IconHide,
  View as IconView,
} from '@element-plus/icons-vue'
import { DIcon } from '@wind-ui/components/index'
import {
  CHANGE_EVENT,
  INPUT_EVENT,
  UPDATE_MODEL_EVENT,
} from '@wind-ui/constants'
import {
  useAttrs,
  useCursor,
  useDisabled,
  useFormItem,
  useFormItemInputId,
  useNamespace,
  useResizeObserver,
  useSize,
} from '@wind-ui/hooks'
import {
  debugWarn,
  isKorean,
  isObject,
  ValidateComponentsMap,
} from '@wind-ui/utils'
import { isNil } from 'lodash-unified'
import type { StyleValue } from 'vue'
import {
  computed,
  getCurrentInstance,
  nextTick,
  onMounted,
  onUpdated,
  ref,
  shallowRef,
  toRef,
  useAttrs as useRawAttrs,
  useSlots,
  watch,
} from 'vue'
import { inputEmits, inputProps } from './input-prop'
import { calcTextareaHeight } from './utils'

type TargetElement = HTMLInputElement | HTMLTextAreaElement

const PENDANT_MAP = {
  suffix: 'append',
  prefix: 'prepend',
} as const
defineOptions({
  name: 'DInput',
  inheritAttrs: false,
})

const props = defineProps(inputProps)
const emit = defineEmits(inputEmits)

const instance = getCurrentInstance()!
const rawAttrs = useRawAttrs()
const slots = useSlots()

const containerAttrs = computed<Record<string, unknown>>(() => {
  const comboBoxAttrs: Record<string, unknown> = {}
  if (props.containerRole === 'combobox') {
    comboBoxAttrs['aria-haspopup'] = rawAttrs['aria-haspopup']
    comboBoxAttrs['aria-owns'] = rawAttrs['aria-owns']
    comboBoxAttrs['aria-expanded'] = rawAttrs['aria-expanded']
  }
  return comboBoxAttrs
})

const attrs = useAttrs({
  excludeKeys: computed<string[]>(() => Object.keys(containerAttrs.value)),
})
const { form, formItem } = useFormItem()
const { inputId } = useFormItemInputId(props, {
  formItemContext: formItem,
})
const inputSize = useSize()
const inputDisabled = useDisabled()
const nsInput = useNamespace('input')
const nsTextarea = useNamespace('textarea')

const input = shallowRef<HTMLInputElement>()
const textarea = shallowRef<HTMLTextAreaElement>()

const focused = ref(false)
const hovering = ref(false)
const isComposing = ref(false)
const passwordVisible = ref(false)
const countStyle = ref<StyleValue>()
const textareaCalcStyle = shallowRef(props.inputStyle)

const _ref = computed(() => input.value || textarea.value)

const needStatusIcon = computed(() => form?.statusIcon ?? false)
const validateState = computed(() => formItem?.validateState || '')
const validateIcon = computed(() => ValidateComponentsMap[validateState.value])
const passwordIcon = computed(() =>
  passwordVisible.value ? IconView : IconHide
)
const containerStyle = computed<StyleValue>(() => [
  rawAttrs.style as StyleValue,
  props.inputStyle,
])
const textareaStyle = computed(() => [
  props.inputStyle,
  textareaCalcStyle.value,
  { resize: props.resize },
])
const nativeInputValue = computed(() =>
  isNil(props.modelValue) ? '' : String(props.modelValue)
)
const showClear = computed(
  () =>
    props.clearable &&
    !inputDisabled.value &&
    !props.readonly &&
    !!nativeInputValue.value &&
    (focused.value || hovering.value)
)
const showPwdVisible = computed(
  () =>
    props.showPassword &&
    !inputDisabled.value &&
    !props.readonly &&
    !!nativeInputValue.value &&
    (!!nativeInputValue.value || focused.value)
)
const isWordLimitVisible = computed(
  () =>
    props.showWordLimit &&
    !!attrs.value.maxlength &&
    (props.type === 'text' || props.type === 'textarea') &&
    !inputDisabled.value &&
    !props.readonly &&
    !props.showPassword
)
const textLength = computed(() => Array.from(nativeInputValue.value).length)
const inputExceed = computed(
  () =>
    isWordLimitVisible.value && textLength.value > Number(attrs.value.maxlength)
)
const suffixVisible = computed(
  () =>
    !!slots.suffix ||
    !!props.suffixIcon ||
    showClear.value ||
    props.showPassword ||
    isWordLimitVisible.value ||
    (!!validateState.value && needStatusIcon.value)
)

const [recordCursor, setCursor] = useCursor(input)

useResizeObserver(textarea, (entries) => {
  if (!isWordLimitVisible.value || props.resize !== 'both') return
  const entry = entries?.[0]
  const { width } = entry.contentRect
  countStyle.value = {
    /** Right: 100% - width + padding(15) + right(6) */
    right: `calc(100% - ${width + 15 + 6}px)`,
  }
})

const resizeTextarea = () => {
  const { type, autosize } = props

  if (type !== 'textarea') return

  if (autosize) {
    const minRows = isObject(autosize) ? autosize.minRows : undefined
    const maxRows = isObject(autosize) ? autosize.maxRows : undefined
    textareaCalcStyle.value = {
      ...calcTextareaHeight(textarea.value!, minRows, maxRows),
    }
  } else {
    textareaCalcStyle.value = {
      minHeight: calcTextareaHeight(textarea.value!).minHeight,
    }
  }
}

const setNativeInputValue = () => {
  const input = _ref.value
  if (!input || input.value === nativeInputValue.value) return
  input.value = nativeInputValue.value
}

const calcIconOffset = (place: 'prefix' | 'suffix') => {
  const { el } = instance.vnode
  if (!el) return
  const elList = Array.from(
    (el as Element).querySelectorAll<HTMLSpanElement>(`.${nsInput.e(place)}`)
  )
  const target = elList.find((item) => item.parentNode === el)
  if (!target) return

  const pendant = PENDANT_MAP[place]

  if (slots[pendant]) {
    target.style.transform = `translateX(${place === 'suffix' ? '-' : ''}${
      el.querySelector(`.${nsInput.be('group', pendant)}`).offsetWidth
    }px)`
  } else {
    target.removeAttribute('style')
  }
}

const updateIconOffset = () => {
  calcIconOffset('prefix')
  calcIconOffset('suffix')
}

const focus = async () => {
  await nextTick()
  _ref.value?.focus()
}

const blur = () => _ref.value?.blur()

const handleInput = async (event: Event) => {
  recordCursor()

  let { value } = event.target as TargetElement

  if (props.formatter) {
    value = props.parser ? props.parser(value) : value
    value = props.formatter(value)
  }

  if (isComposing.value) return

  if (value === nativeInputValue.value) return

  emit(UPDATE_MODEL_EVENT, value)
  emit('input', value)

  await nextTick()
  setNativeInputValue()
  setCursor()
}

const handleChange = (event: Event) => {
  emit(CHANGE_EVENT, (event.target as TargetElement).value)
}

const handleCompositionStart = (event: CompositionEvent) => {
  emit('compositionstart', event)
  isComposing.value = true
}

const handleCompositionUpdate = (event: CompositionEvent) => {
  emit('compositionupdate', event)
  const text = (event.target as HTMLInputElement)?.value
  const lastCharacter = text[text.length - 1] || ''
  isComposing.value = !isKorean(lastCharacter)
}

const handleCompositionEnd = (event: CompositionEvent) => {
  emit('compositionend', event)
  if (isComposing.value) {
    isComposing.value = false
    handleInput(event)
  }
}

const handlePasswordVisible = () => {
  passwordVisible.value = !passwordVisible.value
  focus()
}

const handleFocus = (event: FocusEvent) => {
  focused.value = true
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  focused.value = false
  emit('blur', event)
  if (props.validateEvent) {
    formItem?.validate?.('blur').catch((err) => debugWarn(err))
  }
}

const handleMouseLeave = (evt: MouseEvent) => {
  hovering.value = false
  emit('mouseleave', evt)
}

const handleMouseEnter = (evt: MouseEvent) => {
  hovering.value = true
  emit('mouseenter', evt)
}

const handleKeydown = (evt: KeyboardEvent) => {
  emit('keydown', evt)
}

const select = () => {
  _ref.value?.select()
}

const clear = () => {
  emit(UPDATE_MODEL_EVENT, '')
  emit(CHANGE_EVENT, '')
  emit('clear')
  emit(INPUT_EVENT, '')
}

watch(
  () => props.modelValue,
  () => {
    nextTick(() => resizeTextarea())
    if (props.validateEvent) {
      formItem?.validate?.('change').catch((err) => debugWarn(err))
    }
  }
)

watch(nativeInputValue, () => setNativeInputValue())

watch(
  () => props.type,
  async () => {
    await nextTick()
    setNativeInputValue()
    resizeTextarea()
    updateIconOffset()
  }
)

onMounted(async () => {
  if (!props.formatter && props.parser) {
    debugWarn(
      'ElInput',
      'If you set the parser, you also need to set the formatter.'
    )
  }
  setNativeInputValue()
  updateIconOffset()
  await nextTick()
  resizeTextarea()
})

onUpdated(async () => {
  await nextTick()
  updateIconOffset()
})

defineExpose({
  /** @description HTML input element */
  input,
  /** @description HTML textarea element */
  textarea,
  /** @description HTML element, input or textarea */
  ref: _ref,
  /** @description style of textarea. */
  textareaStyle,

  /** @description from props (used on unit test) */
  autosize: toRef(props, 'autosize'),

  /** @description HTML input element native method */
  focus,
  /** @description HTML input element native method */
  blur,
  /** @description HTML input element native method */
  select,
  /** @description clear input value */
  clear,
  /** @description resize textarea. */
  resizeTextarea,
})
</script>

<template>
  <div
    v-show="type !== 'hidden'"
    v-bind="containerAttrs"
    :class="[
      type === 'textarea' ? nsTextarea.b() : nsInput.b(),
      nsInput.m(inputSize),
      nsInput.is('disabled', inputDisabled),
      nsInput.is('exceed', inputExceed),
      {
        [nsInput.b('group')]: $slots.prepend || $slots.append,
        [nsInput.bm('group', 'append')]: $slots.append,
        [nsInput.bm('group', 'prepend')]: $slots.prepend,
        [nsInput.m('prefix')]: $slots.prefix || prefixIcon,
        [nsInput.m('suffix')]:
          $slots.suffix || suffixIcon || clearable || showPassword,
        [nsInput.bm('suffix', 'password-clear')]: showClear && showPwdVisible,
      },
      $attrs.class,
    ]"
    :style="containerStyle"
    :role="containerRole"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- input -->
    <template v-if="type !== 'textarea'">
      <!-- prepend slot -->
      <div v-if="$slots.prepend" :class="nsInput.be('group', 'prepend')">
        <slot name="prepend" />
      </div>

      <div :class="[nsInput.e('wrapper'), nsInput.is('focus', focused)]">
        <!-- prefix slot -->
        <span v-if="$slots.prefix || prefixIcon" :class="nsInput.e('prefix')">
          <span :class="nsInput.e('prefix-inner')">
            <slot name="prefix" />
            <d-icon v-if="prefixIcon" :class="nsInput.e('icon')">
              <component :is="prefixIcon" />
            </d-icon>
          </span>
        </span>

        <input
          :id="inputId"
          ref="input"
          :class="nsInput.e('inner')"
          v-bind="attrs"
          :type="showPassword ? (passwordVisible ? 'text' : 'password') : type"
          :disabled="inputDisabled"
          :formatter="formatter"
          :parser="parser"
          :readonly="readonly"
          :autocomplete="autocomplete"
          :tabindex="tabindex"
          :aria-label="label"
          :placeholder="placeholder"
          :style="inputStyle"
          @compositionstart="handleCompositionStart"
          @compositionupdate="handleCompositionUpdate"
          @compositionend="handleCompositionEnd"
          @input="handleInput"
          @focus="handleFocus"
          @blur="handleBlur"
          @change="handleChange"
          @keydown="handleKeydown"
        />

        <!-- suffix slot -->
        <span v-if="suffixVisible" :class="nsInput.e('suffix')">
          <span :class="nsInput.e('suffix-inner')">
            <template
              v-if="!showClear || !showPwdVisible || !isWordLimitVisible"
            >
              <slot name="suffix" />
              <d-icon v-if="suffixIcon" :class="nsInput.e('icon')">
                <component :is="suffixIcon" />
              </d-icon>
            </template>
            <d-icon
              v-if="showClear"
              :class="[nsInput.e('icon'), nsInput.e('clear')]"
              @mousedown.prevent
              @click="clear"
            >
              <circle-close />
            </d-icon>
            <d-icon
              v-if="showPwdVisible"
              :class="[nsInput.e('icon'), nsInput.e('password')]"
              @click="handlePasswordVisible"
            >
              <component :is="passwordIcon" />
            </d-icon>
            <span v-if="isWordLimitVisible" :class="nsInput.e('count')">
              <span :class="nsInput.e('count-inner')">
                {{ textLength }} / {{ attrs.maxlength }}
              </span>
            </span>
            <d-icon
              v-if="validateState && validateIcon && needStatusIcon"
              :class="[
                nsInput.e('icon'),
                nsInput.e('validateIcon'),
                nsInput.is('loading', validateState === 'validating'),
              ]"
            >
              <component :is="validateIcon" />
            </d-icon>
          </span>
        </span>
      </div>

      <!-- append slot -->
      <div v-if="$slots.append" :class="nsInput.be('group', 'append')">
        <slot name="append" />
      </div>
    </template>

    <!-- textarea -->
    <template v-else>
      <textarea
        :id="inputId"
        ref="textarea"
        :class="nsTextarea.e('inner')"
        v-bind="attrs"
        :tabindex="tabindex"
        :disabled="inputDisabled"
        :readonly="readonly"
        :autocomplete="autocomplete"
        :style="textareaStyle"
        :aria-label="label"
        :placeholder="placeholder"
        @compositionstart="handleCompositionStart"
        @compositionupdate="handleCompositionUpdate"
        @compositionend="handleCompositionEnd"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @change="handleChange"
        @keydown="handleKeydown"
      />
      <span
        v-if="isWordLimitVisible"
        :style="countStyle"
        :class="nsInput.e('count')"
      >
        {{ textLength }} / {{ attrs.maxlength }}
      </span>
    </template>
  </div>
</template>
