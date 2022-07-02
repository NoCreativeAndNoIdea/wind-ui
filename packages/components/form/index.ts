import { withInstall, withNoopInstall } from '@wind-ui/utils'
import Form from './src/form.vue'
import FormItem from './src/form-item.vue'

export const DForm = withInstall(Form, {
  FormItem,
})

export default DForm
export const DFormItem = withNoopInstall(FormItem)

export * from './src/type/form'
export * from './src/types'
export * from './src/type/form-item'

export type FormInstance = InstanceType<typeof Form>
export type FormItemInstance = InstanceType<typeof FormItem>
