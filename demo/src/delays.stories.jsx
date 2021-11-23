import React from 'react';

export default {
  title: 'delays',
  component: Delay,
};

function Delay({ children, delay }) {
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    const timeoutId = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(timeoutId);
  }, [delay]);

  return show ? children : null;
}

export const ShortDelayAndPass = () => (
  <Delay delay={10}>
    <button id="hi">hello world</button>
  </Delay>
);
ShortDelayAndPass.parameters = {
  axe: { waitForSelector: '#hi' },
};

export const ShortDelayAndFail = () => (
  <Delay delay={10}>
    <button id="hi" role="wut-the-wut">hello world</button>
  </Delay>
);
ShortDelayAndFail.parameters = {
  axe: { waitForSelector: '#hi' },
};

export const MediumDelayAndPass = () => (
  <Delay
    // Should be UNDER the test timeout, which is 2000ms by default.
    delay={500}
  >
    <button id="hi">hello world</button>
  </Delay>
);
MediumDelayAndPass.parameters = {
  axe: { waitForSelector: '#hi' },
};

export const MediumDelayAndFail = () => (
  <Delay
    // Should be UNDER the test timeout, which is 2000ms by default.
    delay={500}
  >
    <button id="hi" role="wut-the-wut">hello world</button>
  </Delay>
);
MediumDelayAndFail.parameters = {
  axe: { waitForSelector: '#hi' },
};

export const LongDelayAndTimeout = () => (
  <Delay
    // Should be OVER the test timeout, which is 2000ms by default.
    delay={3000}
  >
    <button id="hi">hello world</button>
  </Delay>
);
LongDelayAndTimeout.parameters = {
  axe: { waitForSelector: '#hi' },
};
