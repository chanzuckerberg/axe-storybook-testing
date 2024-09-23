const js = require('@eslint/js');
const vitest = require('@vitest/eslint-plugin');
const prettierRecommended = require('eslint-plugin-prettier/recommended');
const react = require('eslint-plugin-react');
const globals = require('globals');
const typescriptEslint = require('typescript-eslint');

/** @type {import("eslint").Linter.Config[]} */
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
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    files: ['**/*.test.*'],
    ...vitest.configs.recommended,
  },
  {
    files: ['demo/**/*.{js,jsx,ts,tsx}'],
    ...react.configs.flat.recommended,
    ...react.configs.flat['jsx-runtime'],
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];
