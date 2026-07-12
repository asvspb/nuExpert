import js from '@eslint/js'
import importPlugin from 'eslint-plugin-import'
import vue from 'eslint-plugin-vue'
import a11y from 'eslint-plugin-vuejs-accessibility'
import tseslint from 'typescript-eslint'
import vueParser from 'vue-eslint-parser'

export default tseslint.config(
  {
    ignores: [
      'dist/**',
      'coverage/**',
      'node_modules/**',
      'playwright-report/**',
      '.nuxt/**',
      '.output/**',
      'server/database/migrations/**',
      '*.cjs'
    ]
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...vue.configs['flat/recommended'],
  {
    files: ['**/*.{js,ts,vue}'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        ecmaVersion: 2023,
        sourceType: 'module'
      }
    },
    plugins: {
      'vuejs-accessibility': a11y,
      'import': importPlugin
    },
    rules: {
      ...a11y.configs.recommended.rules,
      'vue/multi-word-component-names': 'off',
      'import/order': ['error', {
        'alphabetize': { 'order': 'asc', 'caseInsensitive': true }
      }],
      '@typescript-eslint/no-explicit-any': 'warn'
    }
  }
)
