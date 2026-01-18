// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    files: ['**/*.{ts,vue,js,mjs}'],
    rules: {
      'no-console': 'warn',

      '@typescript-eslint/no-unused-vars': ['warn', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        ignoreRestSiblings: true,
      }],

      'vue/no-undef-components': 'off',
    },
  },
)
