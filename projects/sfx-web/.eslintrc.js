module.exports = {
  env: {
    browser: true,
    es6: true
  },
  extends: [
    'plugin:react/recommended',
    'standard'
  ],
  globals: {
    React: 'readonly',
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    JSX: 'readonly'
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  plugins: [
    'react',
    '@typescript-eslint'
  ],
  rules: {
    'no-use-before-define': 'off', // React已经全局定义，但是eslint识别不到所以会报错，这里禁用
    '@typescript-eslint/no-use-before-define': 'off',
    'no-unused-vars': 'off'
  }
}
