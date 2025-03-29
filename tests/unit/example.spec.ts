import { mount } from '@vue/test-utils'
import Main from '@/views/MainPage.vue'
import { describe, expect, test } from 'vitest'

describe('MainPage.vue', () => {
  test('renders home vue', () => {
    const wrapper = mount(Main)
    expect(wrapper.text()).toMatch('Wetter3.de')
  })
})
