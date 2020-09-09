# @chanzuckerberg/axe-storybook

[![Package Status](https://img.shields.io/npm/v/@chanzuckerberg/axe-storybook.svg)](https://www.npmjs.com/package/@chanzuckerberg/axe-storybook) ![Tests](https://github.com/chanzuckerberg/axe-storybook/workflows/Tests/badge.svg)

Run accessibility checks via [axe-core](https://github.com/dequelabs/axe-core) on your [Storybook stories](https://storybook.js.org/docs/react/api/csf) and report the results.

Originally based on [@percy/storybook](https://github.com/percy/percy-storybook).

## Project goals

Here are the goals of this project. They'll be used to determine development work and direction, and triage bugs and pull requests.

1. Run axe-core on Storybook stories written in [Component Story Format](https://storybook.js.org/docs/react/api/csf).
2. Be human readable on local machines (in other words, useful outside of a CI).
3. Have reasonable performance. It doesn't have to maximize speed in every possible way, but needs to be fast enough that people will actually use it.
4. Allow configuration of axe rules, so that people can fit the tool to their needs.
