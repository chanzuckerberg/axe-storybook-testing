module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
  },
  extends: [
    '@chanzuckerberg/eslint-config-edu-js',
    '@chanzuckerberg/eslint-config-edu-ts',
    'plugin:prettier/recommended',
    'prettier',
  ],
  ignorePatterns: ['storybook-static/', 'build/'],
};
