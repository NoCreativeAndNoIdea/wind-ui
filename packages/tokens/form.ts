import type {
  FormEmits,
  FormProps,
  FormItemProp,
  FormItemProps,
} from '@wind-ui/components/form'
import type { FormLabelWidthContext } from '@wind-ui/components/form/src/types'
import type { ComponentSize } from '@wind-ui/constants'
import type { Arrayable } from '@wind-ui/utils'
import type {
  RuleItem,
  ValidateError,
  ValidateFieldsError,
} from 'async-validator'
import type { InjectionKey, SetupContext, UnwrapRef } from 'vue'

export interface FormItemRule extends RuleItem {
  trigger?: Arrayable<string>
}

export type FormValidationResult = Promise<boolean>
export type FormValidateCallback = (
  isValid: boolean,
  invalidFields?: ValidateFieldsError
) => void

export interface FormValidateFailure {
  errors: ValidateError[] | null
  fields: ValidateFieldsError
}

export type FormRules = Partial<Record<string, Arrayable<FormItemRule>>>

export type FormContext = FormProps &
  UnwrapRef<FormLabelWidthContext> & {
    emit: SetupContext<FormEmits>['emit']

    // Expose
    addField: (field: FormItemContext) => void
    removeField: (filed: FormItemContext) => void
    resetFields: (props?: Arrayable<FormItemProp>) => void
    clearValidate: (props?: Arrayable<FormItemProp>) => void
    validateFiled: (
      props?: Arrayable<FormItemProp>,
      callback?: FormValidateCallback
    ) => FormValidationResult
  }

export interface FormItemContext extends FormItemProps {
  $el: HTMLDivElement | undefined
  size: ComponentSize
  validateState: string
  isGroup: boolean
  labelId: string
  inputIds: string[]
  addInputId: (id: string) => void
  removeInputId: (id: string) => void
  validate: (
    trigger: string,
    callback?: FormValidateCallback
  ) => FormValidationResult
  resetField(): void
  clearValidate(): void
}

export const formContextKey: InjectionKey<FormContext> =
  Symbol('formContextKey')

export const formItemContextKey: InjectionKey<FormItemContext> =
  Symbol('formItemContextKey')
