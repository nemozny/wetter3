import pluginVue from 'eslint-plugin-vue'
import {
  defineConfigWithVueTs,
  vueTsConfigs,
} from '@vue/eslint-config-typescript'

export default defineConfigWithVueTs(
  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,
  {
    ignores: ['*.d.ts', '**/coverage', '**/dist', '**/android', '**/ios', '**/node_modules', '**/cypress'],
  }
)