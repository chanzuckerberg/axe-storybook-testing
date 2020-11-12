module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/typescript',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
    'import',
  ],
  ignorePatterns: ['storybook-static/', 'build/'],
  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    'comma-dangle': ['error', 'always-multiline'],
    'import/order': ['error', { alphabetize: { order: 'asc' } }],
    semi: ['error', 'always'],
    quotes: ['error', 'single', { avoidEscape: true }],
  },
};
