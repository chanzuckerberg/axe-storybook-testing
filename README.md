# @chanzuckerberg/axe-storybook-testing

[![Package Status](https://img.shields.io/npm/v/@chanzuckerberg/axe-storybook-testing.svg)](https://www.npmjs.com/package/@chanzuckerberg/axe-storybook-testing) ![Tests](https://github.com/chanzuckerberg/axe-storybook-testing/workflows/Tests/badge.svg)

Command line interface for running accessibility tests (using [axe-core](https://github.com/dequelabs/axe-core)) on your [Storybook stories](https://storybook.js.org/docs/react/api/csf).

If there are any violations, information about them will be printed, and the command will exit with a non-zero exit code. That way, you can use this as automated accessibility tests on CI.

## Table of contents

- [Project goals](#project-goals)
- [Installation](#installation)
- [Usage](#usage)
- [Options](#options)
- [Configuring stories](#configuring-stories)
  - [disabled](#disabled)
  - [disabledRules](#disabledrules)
- [Developing](#developing)
- [Inspiration](#inspiration)

## Project goals

These will be used to determine development work and direction, and triage bugs and pull requests.

1. Run axe-core on Storybook stories written in [Component Story Format](https://storybook.js.org/docs/react/api/csf).
2. Run on CI as automated accessibility tests.
3. Also be useful for humans to run on local machines.
3. Have reasonable performance. It doesn't have to maximize speed, but needs to be fast enough that people will actually use it.
4. Allow people to adopt incrementally. For example, by allowing rules to be disabled.

## Installation

```sh
# via npm
npm install --save-dev @chanzuckerberg/axe-storybook-testing

# or, if using Yarn
yarn add --dev @chanzuckerberg/axe-storybook-testing
```

## Usage

This package works by analyzing the static files that Storybook produces. Therefore, Storybook's build command must be ran first.

To make this as easy as possible to use, we recommend adding a script to your package.json that builds Storybook and then executes the `axe-storybook` command.

```json
// In package.json
"scripts": {
  "storybook:axe": "build-storybook && axe-storybook"
},
```

Then you can run the tests with

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
`--browser`|`chromium`|chromium, firefox, or webkit|Which browser to run the tests in
`--build-dir`|`storybook-static`|string|Storybook static build directory
`--format`|`spec`|string|Format to output test data in. Right now the only option is "spec"
`--headless`|`true`|boolean|Whether to run headlessly or not
`--pattern`|`.*`|string regex|Only run tests that match a component name pattern
`--timeout`|2000|number|Timeout (in milliseconds) for each test

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

## Developing

If you want to work on this project or contribute back to it, see our [wiki entry on Development setup](https://github.com/chanzuckerberg/axe-storybook-testing/wiki/Development-setup).

## Inspiration

This project was originally based on [@percy/storybook](https://github.com/percy/percy-storybook).
