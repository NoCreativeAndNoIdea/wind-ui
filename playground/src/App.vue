<script lang="ts" setup>
import { ref } from 'vue'

const formModel = ref({
  name: 'string',
})
</script>

<template>
  play ground:
  <d-form :model="formModel">
    <d-form-item required prop="name" label="demo">
      <d-input v-model="formModel.name" />
    </d-form-item>
    <d-form-item>
      <d-button native-type="reset"> reset </d-button>
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
