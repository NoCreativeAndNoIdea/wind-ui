import {
  buildProps,
  definePropType,
  isArray,
  isFragement,
  isNumber,
  isString,
  isValidElementNode,
  PatchFlags,
} from '@wind-ui/utils'
import type { ExtractPropTypes, StyleValue, VNode, VNodeChild } from 'vue'
import {
  renderSlot,
  createVNode,
  isVNode,
  defineComponent,
  createTextVNode,
} from 'vue'
import { componentSizes } from '@wind-ui/constants'
import { useSpace } from './use-space'
import Item from './item.vue'

export const spaceProps = buildProps({
  direction: {
    type: String,
    values: ['horizontal', 'vertical'],
    default: 'horizontal',
  },
  class: {
    type: definePropType<string | string[] | Record<string, boolean>>([
      String,
      Object,
      Array,
    ]),
    default: '',
  },
  style: {
    type: definePropType<StyleValue>([String, Array, Object]),
    default: '',
  },

  alignment: {
    type: definePropType<AlignSetting>(String),
    default: 'center',
  },

  prefixCls: {
    type: String,
  },

  spacer: {
    type: definePropType<VNodeChild>([Object, String, Number, Array]),
    default: null,
    validator: (val: unknown) => isVNode(val) || isNumber(val) || isString(val),
  },

  wrap: {
    type: Boolean,
    default: false,
  },
  fill: {
    type: Boolean,
    default: false,
  },
  fillRation: {
    type: Number,
    default: 100,
  },
  size: {
    type: [String, Array, Number],
    values: componentSizes,
    validator: (val: unknown): val is [number, number] | number =>
      isNumber(val) ||
      (isArray(val) && val.length === 2 && val.every((i) => isNumber(i))),
  },
} as const)

export type SpaceProps = ExtractPropTypes<typeof spaceProps>

export default defineComponent({
  name: 'DSpace',
  props: spaceProps,

  setup(props, { slots }) {
    const { classes, containerStyle, itemStyle } = useSpace(props)

    return () => {
      const { spacer, prefixCls, direction } = props

      const children = renderSlot(slots, 'default', { key: 0 }, () => [])

      if ((children.children ?? []).length === 0) return null

      if (isArray(children.children)) {
        let extractedChildren: VNode[] = []
        children.children.forEach((child, loopKey) => {
          if (isFragement(child)) {
            if (isArray(child.children)) {
              child.children.forEach((nested, key) => {
                extractedChildren.push(
                  createVNode(
                    Item,
                    {
                      style: itemStyle.value,
                      prefixCls,
                      key: `nested-${key}`,
                    },
                    { default: () => [nested] },
                    PatchFlags.PROPS | PatchFlags.STYLE,
                    ['style', 'prefixCls']
                  )
                )
              })
            }
          } else if (isValidElementNode(child)) {
            extractedChildren.push(
              createVNode(
                Item,
                {
                  style: itemStyle.value,
                  prefixCls,
                  key: `LoopKey${loopKey}`,
                },
                {
                  default: () => [child],
                },
                PatchFlags.PROPS | PatchFlags.STYLE,
                ['style', 'prefixCls']
              )
            )
          }
        })

        if (spacer) {
          const len = extractedChildren.length - 1
          extractedChildren = extractedChildren.reduce<VNode[]>(
            (acc: VNode[], child: VNode, inx) => {
              const children = [...acc, child]

              if (inx !== len) {
                children.push(
                  createVNode(
                    'span',
                    {
                      style: [
                        itemStyle.value,
                        direction === 'vertical' ? 'width:100%' : null,
                      ],
                      key: inx,
                    },
                    [
                      isVNode(spacer)
                        ? spacer
                        : createTextVNode(spacer as string, PatchFlags.TEXT),
                    ],
                    PatchFlags.STYLE
                  )
                )
              }

              return children
            },
            []
          )
        }

        return createVNode(
          'div',
          {
            class: classes.value,
            style: containerStyle.value,
          },
          extractedChildren,
          PatchFlags.STYLE | PatchFlags.CLASS
        )
      }

      return children.children
    }
  },
})
