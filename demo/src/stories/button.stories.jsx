import React from 'react';

function Button({ children, ...rest }) {
  return <button {...rest}>{children}</button>;
}

export default {
  title: 'button',
  component: Button,
};

export const Button1 = () => <Button>Click me!</Button>;
Button1.storyName = 'Button with text (should pass)';

export const Button2 = () => <Button aria-label="Click me!">❤️</Button>;
Button2.storyName = 'Button with emoji and label (should pass)';

export const Button3 = () => <Button style={{ height: 25, width: 50 }}></Button>;
Button3.storyName = 'Button with no discernible text (should fail)';

export const Button4 = () => <Button style={{ backgroundColor: 'red', color: 'hotpink'}}>Click me!</Button>;
Button4.storyName = 'Button with insufficient color contrast (should fail)';

export const Button5 = () => <Button style={{ backgroundColor: 'red', color: 'hotpink' }}>Click me!</Button>;
Button5.storyName = 'Button with insufficient color contrast but skipped (should pass)';
Button5.parameters = {
  axe: {
    disabled: true,
  },
};

export const Button6 = () => (
  <>
    <Button style={{ backgroundColor: 'limegreen', color: 'hotpink' }}>Click me!</Button>
    <Button style={{ backgroundColor: 'hotpink', color: 'limegreen' }}>Click me!</Button>
  </>
);
Button6.storyName = 'Multiple buttons with insufficient color contrast (should fail)';
