const globals = require('globals');
const jestPlugin = require('eslint-plugin-jest');
const js = require('@eslint/js');
const prettierRecommended = require('eslint-plugin-prettier/recommended');
const reactRecommended = require('eslint-plugin-react/configs/recommended');
const typescriptEslint = require('typescript-eslint');

/** @type {import("eslint").Linter.FlatConfig[]} */
module.exports = [
  {
    ignores: ['**/storybook-static/', '**/build/'],
  },
  js.configs.recommended,
  ...typescriptEslint.configs.recommended,
  prettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'no-prototype-builtins': 'off',
    },
  },
  {
    files: ['**/*.js'],
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
    },
  },
  {
    files: ['**/*.test.*'],
    ...jestPlugin.configs['flat/recommended'],
  },
  {
    files: ['demo/**/*.{js,jsx,ts,tsx}'],
    ...reactRecommended,
    languageOptions: {
      ...reactRecommended.languageOptions,
      globals: {
        ...globals.browser,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...reactRecommended.rules,
      'react/prop-types': 0,
    },
  },
];
