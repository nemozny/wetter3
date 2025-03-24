import { mount } from '@vue/test-utils'
import Main from '@/views/Main.vue'
import { describe, expect, test } from 'vitest'

describe('Main.vue', () => {
  test('renders home vue', () => {
    const wrapper = mount(Main)
    expect(wrapper.text()).toMatch('Menu')
  })
})
