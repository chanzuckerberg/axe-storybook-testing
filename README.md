# @chanzuckerberg/axe-storybook-testing

[![Package Status](https://img.shields.io/npm/v/@chanzuckerberg/axe-storybook-testing.svg)](https://www.npmjs.com/package/@chanzuckerberg/axe-storybook-testing) ![Tests](https://github.com/chanzuckerberg/axe-storybook-testing/workflows/Tests/badge.svg)

Command line interface for running [axe-core](https://github.com/dequelabs/axe-core) accessibility tests on your [Storybook stories](https://storybook.js.org/docs/react/api/csf).

If there are any violations, information about them will be printed, and the command will exit with a non-zero exit code. That way, you can use this as automated accessibility tests on CI.

## Table of contents

- [@chanzuckerberg/axe-storybook-testing](#chanzuckerbergaxe-storybook-testing)
  - [Table of contents](#table-of-contents)
  - [Minimum requirements](#minimum-requirements)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Options](#options)
  - [Story parameters](#story-parameters)
    - [skip](#skip)
    - [disabledRules](#disabledrules)
    - [timeout](#timeout)
    - [waitForSelector](#waitforselector)
  - [TypeScript](#typescript)
  - [Developing](#developing)
  - [Inspiration](#inspiration)

## Minimum requirements

- Node 12
- Storybook 6.4 (for previous versions of Storybook, use axe-storybook-testing v4.1.3)
- axe-core 4.0

## Installation

```sh
# via npm
npm install --save-dev @chanzuckerberg/axe-storybook-testing

# or, if using Yarn
yarn add --dev @chanzuckerberg/axe-storybook-testing
```

## Usage

To use:

1. Create a static Storybook build. Normally you'll do this with the [build-storybook command](https://storybook.js.org/docs/react/api/cli-options#build-storybook).
2. Run `axe-storybook`, which will analyze the static build.

To make this as easy as possible to use, we recommend adding a script to your package.json that does this in one step.

```jsonc
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

The command-line interface has the following options:

| Option                | Default            | Values                                                                                      | Description                                                                                                                                                                 |
| --------------------- | ------------------ | ------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--browser`           | `chromium`         | chromium, firefox, webkit                                                                   | Which browser to run the tests in                                                                                                                                           |
| `--build-dir`         | `storybook-static` | path                                                                                        | Storybook static build directory                                                                                                                                            |
| `--failing-impact`    | `all`              | all, minor, moderate, serious, critical                                                     | The lowest impact level that should be considered a failure                                                                                                                 |
| `--headless`          | `true`             | boolean                                                                                     | Whether to run headlessly or not                                                                                                                                            |
| `--pattern`           | `.*`               | regex pattern                                                                               | Only run tests that match a component name pattern                                                                                                                          |
| `--reporter`          | `spec`             | spec, dot, nyan, tap, landing, list, progress, json, json-stream, min, doc, markdown, xunit | How to display the test run. Can be any [built-in Mocha reporter](https://mochajs.org/#reporters).                                                                          |
| `--reporter-options`  |                    | string                                                                                      | Options to pass to the mocha reporter. Especially useful with the xunit reporter - e.g. `--reporter-options output=./filename.xml`                                          |
| `--storybook-address` |                    | url                                                                                         | Storybook server address to test against instead of using a static build directory. If set, `--build-dir` will be ignored. e.g. `--storybook-address http://localhost:6006` |
| `--timeout`           | 2000               | number                                                                                      | Timeout (in milliseconds) for each test                                                                                                                                     |

For example, to run non-headlessly in Firefox, you would run

```sh
# If using npm
npm run storybook:axe -- --headless false --browser firefox

# or, if using Yarn
yarn storybook:axe --headless false --browser firefox
```

## Story parameters

Stories can use parameters to configure how axe-storybook-testing handles them.

### skip

Prevent axe-storybook-testing from running a story by using the `skip` parameter.

```jsx
// SomeComponent.stories.jsx

export const SomeStory = {
  parameters: {
    axe: {
      skip: true,
    },
  },
};
```

### disabledRules

Prevent axe-storybook-testing from running specific Axe rules on a story by using the `disabledRules` parameter.

```jsx
// SomeComponent.stories.jsx

export const SomeStory = {
  parameters: {
    axe: {
      disabledRules: ['select-name'],
    },
  }.
};
```

Rules can also be disabled globally by [setting this parameter for **all stories** in .storybook/preview.js](https://storybook.js.org/docs/react/writing-stories/parameters#global-parameters).

```jsx
// .storybook/preview.js

export const parameters = {
  axe: {
    disabledRules: ['select-name'],
  },
};
```

### timeout

Overrides global `--timeout` for this specific test

```jsx
// SomeComponent.stories.jsx

export const SomeStory = {
  parameters: {
    axe: {
      timeout: 5000,
    },
  },
};
```

### runOptions

Allows use of any of the available [`axe.run`](https://www.deque.com/axe/core-documentation/api-documentation/#options-parameter) options. See the link for more details. When using `runOptions.rules` in combination with `disabledRules`, **`disabledRules` will always take precedent.**

```jsx

export const SomeStory = {
  parameters: {
    axe: {
      runOptions: {
        preload: true,
        selectors: true,
        ...
      }
    }
  };
```

### waitForSelector

**Deprecated!**

Legacy way of waiting for a selector before running Axe.

Now we recommend using a Storybook [play function](https://storybook.js.org/docs/react/writing-stories/play-function) to do the same thing.

```jsx
// SomeComponent.stories.jsx

// Old, deprecated way.
export const SomeStory = {
  parameters: {
    axe: {
      waitForSelector: '#some-component-selector',
    },
  },
};

// New, better way using a play function - https://storybook.js.org/docs/react/writing-stories/play-function
SomeStory.play = async () => {
  await screen.findByText('some string');
};
```

## TypeScript

axe-storybook-testing provides TypeScript types for the story parameters listed above.
Story parameters can be type checked by augmenting Storybook's `Parameter` type:

```ts
// overrides.d.ts

import type { AxeParams } from '@chanzuckerberg/axe-storybook-testing';

declare module '@storybook/react' {
  // Augment Storybook's definition of Parameters so it contains valid options for axe-storybook-testing
  interface Parameters {
    axe?: AxeParams;
  }
}
```

Annotate your stories with the `StoryObj` type, and your parameters will be type-checked!

```ts
// SomeComponent.stories.ts

export const SomeStory: StoryObj<Args> = {
  parameters: {
    axe: {
      timeout: 5000,
    },
  },
};
```

## Developing

If you want to work on this project or contribute back to it, see our [wiki entry on Development setup](https://github.com/chanzuckerberg/axe-storybook-testing/wiki/Development-setup).

## Inspiration

This project was originally based on [@percy/storybook](https://github.com/percy/percy-storybook).
