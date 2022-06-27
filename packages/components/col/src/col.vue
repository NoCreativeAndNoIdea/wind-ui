<script setup lang="ts">
import { computed } from '@vue/reactivity'
import { useNamespace } from '@wind-ui/hooks'
import { rowContextKey } from '@wind-ui/tokens'
import { isNumber, isObject } from '@wind-ui/utils'
import type { CSSProperties } from 'vue'
import { inject } from 'vue'
import { colProps } from './col'

defineOptions({
  name: 'DCol',
})

const props = defineProps(colProps)
const ns = useNamespace('col')

const { gutter } = inject(rowContextKey, { gutter: computed(() => 0) })

const style = computed(() => {
  const styles: CSSProperties = {}
  if (gutter.value) {
    const px = `${gutter.value / 2}px`
    styles.paddingLeft = px
    styles.paddingRight = px
  }
  return styles
})

const classes = computed(() => {
  const classes: string[] = []
  const pos = ['span', 'offset', 'pull', 'push'] as const

  pos.forEach((prop) => {
    const size = props[prop]
    if (isNumber(size)) {
      if (prop === 'span') classes.push(ns.b(`${props[prop]}`))
      else if (size > 0) classes.push(ns.b(`${prop}-${props[prop]}`))
    }
  })

  const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const
  sizes.forEach((size) => {
    if (isNumber(props[size])) {
      classes.push(ns.b(`${size}-${props[size]}`))
    } else if (isObject(props[size])) {
      Object.entries(props[size]).forEach(([prop, sizeProp]) => {
        classes.push(
          prop !== 'span'
            ? ns.b(`${size}-${prop}-${sizeProp}`)
            : ns.b(`${size}-${sizeProp}`)
        )
      })
    }
  })

  if (gutter.value) {
    classes.push(ns.is('guttered'))
  }

  return classes
})
</script>

<template>
  <component :is="tag" :class="[ns.b(), ...classes]" :style="style">
    <slot />
  </component>
</template>
