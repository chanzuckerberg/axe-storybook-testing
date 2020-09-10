import React from 'react';

function Input(props) {
  return <input {...props} />;
}

export default {
  title: 'input',
  component: Input,
};

export const Input1 = () => (
  <label>
    Favorite coffee
    <Input />
  </label>
);
Input1.storyName = 'Input with label (should pass)';

export const Input2 = () => <Input placeholder="Favorite coffee" />;
Input2.storyName = 'Input without label (should fail)';

export const Input3 = () => <Input placeholder="Favorite coffee" />;
Input3.storyName = 'Input without label but skipped (should pass)';
Input3.parameters = {
  axe: {
    disabled: true,
  },
};

export const Input4 = () => <Input placeholder="Favorite coffee" role="wut-the-wut" />;
Input4.storyName = 'Input without label and invalid role (should fail)';
