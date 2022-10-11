import React from 'react';

export default {
  title: 'delays',
  component: Delay,
};

function Delay({children, delay}) {
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    const timeoutId = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(timeoutId);
  }, [delay]);

  return show ? children : null;
}

export const ShortDelayAndPass = {
  render: () => (
    <Delay delay={10}>
      <button id="hi">hello world</button>
    </Delay>
  ),
  parameters: {
    axe: {waitForSelector: '#hi'},
  },
};

export const ShortDelayAndFail = {
  render: () => (
    <Delay delay={10}>
      <button id="hi" role="wut-the-wut">
        hello world
      </button>
    </Delay>
  ),
  parameters: {
    axe: {waitForSelector: '#hi'},
  },
};

export const MediumDelayAndPass = {
  render: () => (
    <Delay
      // Should be UNDER the test timeout, which is 2000ms by default.
      delay={500}
    >
      <button id="hi">hello world</button>
    </Delay>
  ),
  parameters: {
    axe: {waitForSelector: '#hi'},
  },
};

export const MediumDelayAndFail = {
  render: () => (
    <Delay
      // Should be UNDER the test timeout, which is 2000ms by default.
      delay={500}
    >
      <button id="hi" role="wut-the-wut">
        hello world
      </button>
    </Delay>
  ),
  parameters: {
    axe: {waitForSelector: '#hi'},
  },
};

export const MediumDelayAndShortTimeoutFail = {
  render: () => (
    <Delay
      // Should be UNDER the test timeout, which is 2000ms by default.
      delay={500}
    >
      <button id="hi">hello world</button>
    </Delay>
  ),
  parameters: {
    axe: {waitForSelector: '#hi', timeout: 100},
  },
};

export const LongDelayAndTimeout = {
  render: () => (
    <Delay
      // Should be OVER the test timeout, which is 2000ms by default.
      delay={3000}
    >
      <button id="hi">hello world</button>
    </Delay>
  ),
  parameters: {
    axe: {waitForSelector: '#hi'},
  },
};
