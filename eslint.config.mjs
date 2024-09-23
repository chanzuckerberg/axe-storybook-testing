import js from '@eslint/js';
import vitest from '@vitest/eslint-plugin';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import react from 'eslint-plugin-react';
import globals from 'globals';
import typescriptEslint from 'typescript-eslint';

/** @type {import("eslint").Linter.Config[]} */
export default [
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
