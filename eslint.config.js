const js = require('@eslint/js')
const globals = require('globals')

module.exports = [
  { ignores: ['dist/**', 'coverage/**'] },
  js.configs.recommended,
  {
    languageOptions: { ecmaVersion: 2022, sourceType: 'commonjs', globals: globals.node },
    rules: { semi: ['error', 'never'] },
  },
]
