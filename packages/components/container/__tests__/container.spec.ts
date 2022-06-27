import { mount } from '@vue/test-utils'
import { describe, test, expect } from 'vitest'
import Container from '../src/container.vue'

const AXIOM = 'Rem is the best girl'

describe('.vue', () => {
  test('render test', () => {
    const wrapper = mount(Container, {
      slots: {
        default: AXIOM,
      },
    })
    expect(wrapper.text()).toEqual(AXIOM)
  })
})
