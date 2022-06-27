<script lang="ts" setup>
import { useNamespace } from '@wind-ui/hooks'

defineOptions({
  name: 'DMain',
})

const ns = useNamespace('main')
</script>
<template>
  <main :class="ns.b()">
    <slot />
  </main>
</template>
