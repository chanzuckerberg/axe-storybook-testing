module.exports = {
  env: {
    node: true,
    es6: true
  },
  extends: ['eslint:recommended', 'plugin:react/recommended'],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  settings: {
    react: {
      version: "latest",
    },
  },
  rules: {}
};
