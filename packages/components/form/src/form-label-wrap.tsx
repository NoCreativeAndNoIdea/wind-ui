import { useNamespace, useResizeObserver } from '@wind-ui/hooks'
import { formContextKey, formItemContextKey } from '@wind-ui/tokens'
import { throwError } from '@wind-ui/utils'
import type { CSSProperties } from 'vue'
import {
  Fragment,
  computed,
  defineComponent,
  inject,
  nextTick,
  onBeforeUnmount,
  onMounted,
  onUpdated,
  ref,
  watch,
} from 'vue'

const COMPONENT_NAME = 'DLabelWrap'

export default defineComponent({
  name: COMPONENT_NAME,
  props: {
    isAutoWidth: Boolean,
    updateAll: Boolean,
  },

  setup(props, { slots }) {
    const formContext = inject(formContextKey, undefined)
    const formItemContext = inject(formItemContextKey)

    if (!formItemContext) {
      throwError(
        COMPONENT_NAME,
        'usage: <d-form-item><label-wrap /></d-form-item>'
      )
    }

    const ns = useNamespace('form')

    const el = ref<HTMLElement>()
    const computedWidth = ref(0)
    const getLabelWidth = () => {
      if (el.value?.firstElementChild) {
        const { width } = window.getComputedStyle(el.value?.firstElementChild)
        return Math.ceil(Number.parseFloat(width))
      } else {
        return 0
      }
    }

    const updateLabelWidth = (action: 'update' | 'remove' = 'update'): void => {
      nextTick(() => {
        if (slots.default && props.isAutoWidth) {
          if (action === 'update') {
            computedWidth.value = getLabelWidth()
          } else if (action === 'remove') {
            formContext?.deregisterLabelWidth(computedWidth.value)
          }
        }
      })
    }

    const updateLabelWidthFn = () => updateLabelWidth('update')

    onMounted(() => {
      updateLabelWidthFn()
    })
    onBeforeUnmount(() => {
      updateLabelWidth('remove')
    })

    onUpdated(() => updateLabelWidthFn())

    watch(computedWidth, (value, oldVal) => {
      if (props.updateAll) {
        formContext?.registerLabelWidth(value, oldVal)
      }
    })

    useResizeObserver(
      computed(() => (el.value?.firstElementChild as HTMLElement) ?? null),
      updateLabelWidthFn
    )

    return () => {
      if (!slots) return null

      const { isAutoWidth } = props

      if (isAutoWidth) {
        const autoLabelWidth = formContext?.autoLabelWidth
        const style: CSSProperties = {}
        if (autoLabelWidth && autoLabelWidth !== 'auto') {
          const marginWidth = Math.max(
            0,
            Number.parseInt(autoLabelWidth, 10) - computedWidth.value
          )
          const marginPosition =
            formContext.labelPosition === 'left' ? 'marginRight' : 'marginLeft'
          if (marginWidth) {
            style[marginPosition] = `${marginWidth}px`
          }
        }

        return (
          <div ref={el} class={[ns.be('item', 'label-wrap')]} style={style}>
            {slots.default?.()}
          </div>
        )
      } else {
        return <Fragment ref={el}>{slots.default?.()}</Fragment>
      }
    }
  },
})
