import React from 'react';

export default {
  title: 'simple',
  component: 'button',
};

export const NoFailures = () => <button>hello world</button>;
export const FailureNoDiscernibleText = () => <button></button>;
export const FailureColorContrast = () => <button style={{ backgroundColor: 'red', color: 'hotpink' }}>hello world</button>;
export const FailureNoDiscernibleTextAndInvalidRole = () => <button role="wut-the-wut"></button>;

export const FailureColorContrastSkipped = FailureColorContrast.bind(null);
FailureColorContrastSkipped.parameters = {
  axe: { skip: true },
};

export const FailureNoDiscernibleTextAndInvalidRoleSkipped = FailureNoDiscernibleTextAndInvalidRole.bind(null);
FailureNoDiscernibleTextAndInvalidRoleSkipped.parameters = {
  axe: { skip: true },
};

export const FailureColorContrastDisabledRule = FailureColorContrast.bind(null);
FailureColorContrastDisabledRule.parameters = {
  axe: { disabledRules: ['color-contrast'] },
};

export const FailureNoDiscernibleTextAndInvalidRoleDisabledOneRule = FailureNoDiscernibleTextAndInvalidRole.bind(null);
FailureNoDiscernibleTextAndInvalidRoleDisabledOneRule.parameters = {
  axe: { disabledRules: ['aria-roles'] },
};

export const FailureNoDiscernibleTextAndInvalidRoleDisabledRules = FailureNoDiscernibleTextAndInvalidRole.bind(null);
FailureNoDiscernibleTextAndInvalidRoleDisabledRules.parameters = {
  axe: { disabledRules: ['aria-roles', 'button-name'] },
};
