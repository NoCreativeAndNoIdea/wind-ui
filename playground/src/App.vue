<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { RuleRef } from '@wind-ui/hooks'
import { useForm } from '@wind-ui/hooks'

const rules = reactive<RuleRef>({
  name: {
    message: 'name length must = 10!',
    validator: (rule, { value }) => !(value.toString().length !== 10),
  },
  demo: {
    min: 5,
    required: true,
    message: 'demo is must input!',
  },
})

const formModel = ref({
  name: '',
  demo: '',
})

const { resetFields, validateInfos, validateField, validate } = useForm(
  formModel,
  rules
)

const handleSubmit = async () => {
  // Const validate = await validateField('name')
  // Console.log(validate, 'validate')
  validate()
}
</script>

<template>
  play ground:
  <d-form>
    <d-form-item label="name:" v-bind="validateInfos.name">
      <d-input v-model="formModel.name" />
    </d-form-item>
    <d-form-item label="demo:" v-bind="validateInfos.demo">
      <d-input v-model="formModel.demo" />
    </d-form-item>
    <d-form-item>
      <d-button type="warning" @click="resetFields"> reset </d-button>
      <d-button type="primary" @click.prevent="handleSubmit"> submit </d-button>
    </d-form-item>
  </d-form>
</template>

<style lang="scss">
body {
  margin: 0;
  padding: 0;
}
#playground {
  width: 100vw;
  height: 100vh;
  // display: flex;
  // justify-content: center;
  // align-items: center;
  background: var(--wind-bg-page);
}

.scrollbar-flex-content {
  display: flex;
}
.scrollbar-demo-item {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 50px;
  margin: 10px;
  text-align: center;
  border-radius: 4px;
  background: var(--wind-color-danger-light-9);
  color: var(--wind-color-danger);
}

.item {
  width: 40px;
  height: 40px;
  color: #fff;
  text-align: center;
  line-height: 40px;
  background-color: var(--wind-color-primary);
}
</style>
