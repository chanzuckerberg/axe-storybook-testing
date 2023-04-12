module.exports = {
  stories: ["../src"],
  addons: ["@storybook/addon-essentials", "@storybook/addon-a11y"],
  features: {
    storyStoreV7: true
  },
  core: {
    disableTelemetry: true
  },
  framework: {
    name: "@storybook/react-webpack5",
    options: {}
  }
};
