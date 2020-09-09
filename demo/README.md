# Demo app

This app can be used test axe-storybook.

## Storybook

See this app's storybook by running `yarn storybook` in the demo app's directory.

## axe-storybook

axe-storybook can be ran on this demo app.

1. Run `yarn link` from the project root.
1. Run `yarn link @chanzuckerberg/axe-storybook` from the demo app's directory.
1. Make any necessary changes to axe-storybook.
1. Run `yarn build` from the project root. This will need to be done any time you want to try out changes to axe-storybook in the demo app.
1. Run `yarn storybook:axe` from the demo app.
