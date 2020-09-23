# @chanzuckerberg/axe-storybook-testing

[![Package Status](https://img.shields.io/npm/v/@chanzuckerberg/axe-storybook-testing.svg)](https://www.npmjs.com/package/@chanzuckerberg/axe-storybook-testing) ![Tests](https://github.com/chanzuckerberg/axe-storybook-testing/workflows/Tests/badge.svg)

Command-line interface for running accessibility checks via [axe-core](https://github.com/dequelabs/axe-core) on your [Storybook stories](https://storybook.js.org/docs/react/api/csf).

If there are any violations, information about them will be printed and the command will exit with a non-zero exit code. That way, you can use this as automated accessibility tests on CI.

Originally based on [@percy/storybook](https://github.com/percy/percy-storybook).

## Project goals

These will be used to determine development work and direction, and triage bugs and pull requests.

1. Run axe-core on Storybook stories written in [Component Story Format](https://storybook.js.org/docs/react/api/csf).
2. Be human readable on local machines (in other words, useful outside of a CI).
3. Have reasonable performance. It doesn't have to maximize speed in every possible way, but needs to be fast enough that people will actually use it.
4. Allow configuration of axe rules, so that people can fit the tool to their needs.

## Installation

First, install the package

```sh
# via npm
npm install --save-dev @chanzuckerberg/axe-storybook-testing

# or, if using Yarn
yarn add --dev @chanzuckerberg/axe-storybook-testing
```

Second, add a script to your package.json that executes Storybook's `build-storybook` command and runs axe-storybook-testing's `axe-storybook` command

```json
// In package.json
"scripts": {
  "storybook:axe": "build-storybook && axe-storybook"
},
```

## Usage

Assuming you've added the script in the install section above, you'll run this application with

```sh
# If using npm
npm run storybook:axe

# or, if using Yarn
yarn storybook:axe
```

## Options

The command-line interface has the following options.

Option|Default|Type|Description
-|-|-|-
`--browser`|`chromium`|chromium, firefox, or webkit|Which browser to run the tests in.
`--build-dir`|`storybook-static`|string|Storybook static build directory.
`--headless`|`true`|boolean|Whether to run headlessly or not.

For example, to run non-headlessly on Firefox, you would run

```sh
# If using npm
npm run storybook:axe -- --headless false --browser firefox

# or, if using Yarn
yarn storybook:axe --headless false --browser firefox
```

## Configuring stories

Stories can use parameters to configure how axe-storybook-testing handles them.

### disabled

Prevent axe-storybook-testing from running a story by using the `disabled` parameter.

```jsx
SomeStory.parameters = {
  axe: {
    disabled: true,
  },
};
```

### disabledRules

Prevent axe-storybook-testing from running specific Axe rules on a story by using the `disabledRules` parameter.

```jsx
SomeStory.parameters = {
  axe: {
    disabledRules: ['select-name'],
  },
};
```
