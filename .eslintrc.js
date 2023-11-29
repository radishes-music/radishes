/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 2021,
    ecmaFeatures: {
      jsx: true
    },
    parser: {
      '<template>': 'espree'
    },
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json']
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-essential',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier'
    // './.eslintrc-auto-import.json'
  ],
  rules: {
    'prettier/prettier': 2,
    'no-var': 'error',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'vue/html-self-closing': [
      'error',
      {
        html: {
          component: 'always'
        }
      }
    ],
    'vue/require-explicit-emits': [
      'error',
      {
        allowProps: true
      }
    ],
    'vue/one-component-per-file': 'off',
    'vue/require-default-prop': 'off',
    'vue/require-prop-types': 'off',
    'vue/custom-event-name-casing': 'off',
    // temp
    'vue/multi-word-component-names': 'off',
    'vue/require-valid-default-prop': 'off',
    'vue/no-reserved-component-names': 'off',
    '@typescript-eslint/ban-ts-ignore': 'off',
    'no-unused-vars': 'warn',
    'no-undef': 'warn'
    // bad update...
    // https://github.com/prettier/prettier/issues/7972#issuecomment-610255024
    // 'space-before-function-paren': 0,
    // '@typescript-eslint/space-before-function-paren': 0
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)'
      ],
      env: {
        mocha: true
      }
    }
  ],
  globals: {
    defineProps: 'readonly',
    defineEmits: 'readonly',
    defineExpose: 'readonly',
    withDefaults: 'readonly',
    ipcRenderer: 'readonly'
  }
}
