import eslint from '@eslint/js';
import typescriptEslint from 'typescript-eslint';
import eslintPluginVue from 'eslint-plugin-vue';
import globals from 'globals';

export default [
  {
    ignores: [ '**/node_modules', '**/dist', '**/.eslintcache', '**/libs' ]
  },
  eslint.configs.recommended,
  ...typescriptEslint.configs.recommended,
  ...eslintPluginVue.configs['flat/recommended'],
  {
    files: [ '**/*.{js,ts,mjs,mts,jsx,tsx,vue}' ],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        '$': 'readonly',
        'SHIKI_USER': 'readonly',
        ...globals.browser
      },
      parserOptions: {
        parser: typescriptEslint.parser
      }
    },

    rules: {
      'no-empty': 'off',
      'prefer-const': 'off',

      'max-len': [ 0, 120, 2, { ignoreUrls: true } ],
      'arrow-parens': [ 'error', 'always' ],
      'indent': [ 'error', 2 ],
      'semi': [ 'error' ],
      'quotes': [ 'error', 'single' ],
      'comma-dangle': [ 'error', 'never' ],
      'arrow-spacing': 'error',
      'block-spacing': 'error',
      'object-curly-spacing': [ 'error', 'always' ],
      'array-bracket-spacing': [ 'error', 'always' ],
      'comma-spacing': [ 'error', { 'before': false, 'after': true } ]
    }
  },
  {
    files: [ '**/*.{ts,mts,tsx,vue}' ],
    rules: {
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-explicit-any': 'off'
    }
  },
  {
    files: [ '*.vue', '**/*.vue' ],
    rules: {
      'vue/html-indent': [ 'error', 2, {
        'attribute': 1,
        'baseIndent': 1,
        'closeBracket': 1,
        'alignAttributesVertically': true
      } ],
      'vue/html-quotes': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/max-attributes-per-line': [ 'error', {
        singleline: 3,
        multiline: 1
      } ],
      'vue/max-len': [ 'error', {
        'code': 120,
        'template': 120,
        'tabWidth': 2,
        'comments': 120
      } ]
    }
  }
];