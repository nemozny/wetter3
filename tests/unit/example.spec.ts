import { mount } from '@vue/test-utils'
import Main from '@/views/MainPage.vue'
import { describe, expect, test } from 'vitest'


describe('MainPage.vue', () => {
  test('renders without crashing', () => {
    const wrapper = mount(Main)
    expect(wrapper.exists()).toBe(true)
  })
});

describe('MainPage.vue', () => {
  test('contains specific element', () => {
      const wrapper = mount(Main)
      expect(wrapper.find('header').exists()).toBe(true) // Replace 'header' with an actual element in your component
  })
});

describe('MainPage.vue', () => {
  test('renders home vue', () => {
    const wrapper = mount(Main)
    expect(wrapper.text()).toMatch('Wetter3.de')
  })
});
