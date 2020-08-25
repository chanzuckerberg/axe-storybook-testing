import React from 'react';

function Button({ children, ...rest }) {
  return <button {...rest}>{children}</button>;
}

export default {
  title: 'button',
  component: Button,
};

export const Button1 = () => <Button>Click me!</Button>
Button1.storyName = 'Button with text (should pass)';

export const Button2 = () => <Button aria-label="Click me!">❤️</Button>;
Button2.storyName = 'Button with emoji and label (should pass)';

export const Button3 = () => <Button>❤️</Button>;
Button3.storyName = 'Button with emoji but no label (should fail)';

export const Button4 = () => <Button style={{ backgroundColor: 'red', color: 'hotpink'}}>Click me!</Button>
Button4.storyName = 'Button with insufficient color contrast (should fail)';

export const Button5 = () => <Button style={{ backgroundColor: 'red', color: 'hotpink' }}>Click me!</Button>
Button5.storyName = 'Button with insufficient color contrast but skipped (should pass)';
Button5.parameters = {
  axe: {
    skip: true,
  },
};
