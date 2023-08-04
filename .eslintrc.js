module.exports = {
  root: true,
  ignorePatterns: ['storybook-static/', 'build/'],
  env: {
    es6: true,
    node: true,
  },
  extends: [
    '@chanzuckerberg/eslint-config-edu-js',
    '@chanzuckerberg/eslint-config-edu-ts',
    'plugin:prettier/recommended',
    'prettier',
  ],
  overrides: [
    {
      files: ['**/*.test.*'],
      env: {
        'jest/globals': true,
      },
      plugins: ['jest'],
      extends: ['plugin:jest/recommended'],
    },
  ],
};
