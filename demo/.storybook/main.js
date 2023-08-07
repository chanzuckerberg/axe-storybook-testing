module.exports = {
  stories: ["../src"],
  addons: ["@storybook/addon-essentials", "@storybook/addon-a11y"],
  core: {
    disableTelemetry: true
  },
  framework: {
    name: "@storybook/react-webpack5",
    options: {}
  },
  // Provide basic babel config. react-webpack5 seems to actually provide most of this.
  babel: (config) => {
    return {
      ...config,
      sourceType: 'module',
    }
  },
};
