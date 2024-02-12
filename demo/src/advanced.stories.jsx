import React from 'react';

export default {
  title: 'advanced',
  component: 'button',
};

// Testing out passing config to `axe.configure`.
// See https://github.com/chanzuckerberg/axe-storybook-testing/issues/87.
export const branding = {
  render: () => (
    <button style={{backgroundColor: 'red', color: 'hotpink'}}>
      hello world
    </button>
  ),
  parameters: {
    axe: {
      config: {
        branding: 'my-branding',
      },
    },
  },
};
