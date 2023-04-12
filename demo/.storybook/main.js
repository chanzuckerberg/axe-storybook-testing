module.exports = {
  stories: ["../src"],
  addons: ["@storybook/addon-essentials", "@storybook/addon-a11y"],
  core: {
    disableTelemetry: true
  },
  framework: {
    name: "@storybook/react-webpack5",
    options: {}
  }
};
