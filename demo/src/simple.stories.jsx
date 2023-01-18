import React from 'react';

export default {
  title: 'simple',
  component: 'button',
};

export const NoFailures = {render: () => <button>hello world</button>};
export const FailureNoDiscernibleText = {render: () => <button></button>};
export const FailureColorContrast = {
  render: () => (
    <button style={{backgroundColor: 'red', color: 'hotpink'}}>
      hello world
    </button>
  ),
};
export const FailureNoDiscernibleTextAndInvalidRole = {
  render: () => <button role="wut-the-wut"></button>,
};

export const FailureColorContrastSkipped = {
  ...FailureColorContrast,
  parameters: {
    axe: {skip: true},
  },
};

export const NoFailuresWarn = {
  render: () => <button>hello world</button>,
  parameters: {axe: {mode: 'warn'}},
};

export const FailureColorContrastWarn = {
  ...FailureColorContrast,
  parameters: {
    axe: {mode: 'warn'},
  },
};

export const FailureNoDiscernibleTextWarn = {
  render: () => <button></button>,
  parameters: {
    axe: {mode: 'warn'},
  },
};

export const FailureColorContrastOff = {
  ...FailureColorContrast,
  parameters: {
    axe: {mode: 'off'},
  },
};

export const FailureNoDiscernibleTextAndInvalidRoleSkipped = {
  ...FailureNoDiscernibleTextAndInvalidRole,
  parameters: {
    axe: {skip: true},
  },
};

export const FailureColorContrastDisabledRule = {
  ...FailureColorContrast,
  parameters: {
    axe: {disabledRules: ['color-contrast']},
  },
};

export const FailureNoDiscernibleTextAndInvalidRoleDisabledOneRule = {
  ...FailureNoDiscernibleTextAndInvalidRole,
  parameters: {
    axe: {disabledRules: ['aria-roles']},
  },
};

export const FailureNoDiscernibleTextAndInvalidRoleDisabledRules = {
  ...FailureNoDiscernibleTextAndInvalidRole,
  parameters: {
    axe: {disabledRules: ['aria-roles', 'button-name']},
  },
};
