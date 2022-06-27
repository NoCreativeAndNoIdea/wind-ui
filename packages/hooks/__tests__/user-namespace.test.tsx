import { defineComponent, nextTick } from 'vue'
import { useNamespace } from '../user-namespace'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { provideGlobalConfig } from '../use-global-config'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'

const TestComp = defineComponent({
  setup() {
    const ns = useNamespace('table')
    return () => (
      <div
        id="testId"
        class={[
          ns.b(),
          ns.b('body'),
          ns.e('content'),
          ns.m('active'),
          ns.be('content', 'active'),
          ns.em('content', 'active'),
          ns.bem('body', 'content', 'active'),
          ns.is('focus'),
          ns.e(),
          ns.m(),
          ns.be(),
          ns.em(),
          ns.bem(),
          ns.is('hover', undefined),
          ns.is('clicked', false),
        ]}
      >
        test
      </div>
    )
  },
})

describe('use-local', () => {
  const Comp = defineComponent({
    setup(_props, { slots }) {
      provideGlobalConfig({ namespace: 'wind' })
      return () => slots.default?.()
    },
  })

  let wrapper: VueWrapper<InstanceType<typeof Comp>>
  beforeEach(() => {
    wrapper = mount(Comp, {
      slots: { default: () => <TestComp /> },
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('should provide bem correctly', async () => {
    await nextTick()
    expect(wrapper.find('#testId').classes()).toEqual([
      'wind-table', // B
      'wind-table-body', // B('body')
      'wind-table__content', // E('content')
      'wind-table--active', // M('active')
      'wind-table-content__active', // Be('content','active)
      'wind-table__content--active', // Em('content','active)
      'wind-table-body__content--active', // Bem('body','content','active)
      'is-focus', // Is('focus')
    ])
  })
})
