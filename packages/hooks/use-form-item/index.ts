import { useId } from '@wind-ui/hooks/index'
import type { FormItemContext } from '@wind-ui/tokens/index'
import { formContextKey, formItemContextKey } from '@wind-ui/tokens/index'
import type { ComputedRef, Ref, WatchStopHandle } from 'vue'
import {
  computed,
  inject,
  onMounted,
  onUnmounted,
  ref,
  toRef,
  unref,
  watch,
} from 'vue'

export const useFormItem = () => {
  const form = inject(formContextKey, undefined)
  const formItem = inject(formItemContextKey, undefined)
  return {
    form,
    formItem,
  }
}

export interface IUseFormItemInputCommonProps {
  id?: string
  label?: string | number | boolean | Record<string, any>
}

export interface IUseFormItemInputDisabledOption {
  formItemContext?: FormItemContext
  disableIdGeneration?: ComputedRef<boolean> | Ref<boolean>
  disableIdManagement?: ComputedRef<boolean> | Ref<boolean>
}

export const useFormItemInputId = (
  props: IUseFormItemInputCommonProps,
  {
    formItemContext,
    disableIdGeneration,
    disableIdManagement,
  }: IUseFormItemInputDisabledOption
) => {
  if (!disableIdGeneration) {
    disableIdGeneration = ref<boolean>(false)
  }
  if (!disableIdManagement) {
    disableIdManagement = ref<boolean>(false)
  }

  const inputId = ref<string>()
  let idUnwatch: WatchStopHandle | undefined

  const isLabeledByFormItem = computed<boolean>(() =>
    Boolean(
      !props.label &&
        formItemContext &&
        formItemContext.inputIds &&
        formItemContext.inputIds?.length <= 1
    )
  )

  onMounted(() => {
    idUnwatch = watch(
      () => [toRef(props, 'id'), unref(disableIdGeneration)] as any,
      ([id, _disableIdGeneration]: [string, boolean]) => {
        id = unref(id)
        _disableIdGeneration = unref(_disableIdGeneration)
        const newId = id ?? (!_disableIdGeneration ? useId().value : undefined)
        if (newId !== inputId.value) {
          if (formItemContext?.removeInputId) {
            inputId.value && formItemContext.removeInputId(inputId.value)
            if (!disableIdManagement?.value && !_disableIdGeneration && newId) {
              formItemContext.addInputId(newId)
            }
          }
          inputId.value = newId
        }
      },
      {
        immediate: true,
      }
    )
  })

  onUnmounted(() => {
    idUnwatch && idUnwatch()
    if (formItemContext?.removeInputId) {
      inputId.value && formItemContext.removeInputId(inputId.value)
    }
  })

  return {
    isLabeledByFormItem,
    inputId,
  }
}
