module.exports = {
  stories: ['../src'],
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-webpack5-compiler-swc',
  ],
  core: {
    disableTelemetry: true,
  },
  framework: '@storybook/react-webpack5',
};
