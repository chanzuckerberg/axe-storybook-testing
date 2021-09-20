import React from 'react';

export default {
  title: 'delays',
  component: NotDelayed,
};

function NotDelayed() {
  // axe violation since tab must be within a tablist.
  return <button id="the-tab" role="tab">Tab</button>;
}

// Render NotDelayed after a timeout. Should initially "pass" accessibility checks, since there is
// nothing initially rendered. But if we either run them again (in Storybook) or delay the Axe check
// (with `waitForSelector`) we should see the failure.
function Delayed({ delay }) {
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShow(true);
    }, delay);
    return () => clearTimeout(timeoutId);
  }, [delay]);

  return show ? <NotDelayed /> : null;
}

export const NoDelay = () => <NotDelayed />;
NoDelay.storyName = 'NoDelay (should fail)';

export const ShortDelay = () => <Delayed delay={500} />;
ShortDelay.storyName = 'ShortDelay (should fail)';
ShortDelay.parameters = {
  axe: {
    waitForSelector: '#the-tab',
  },
};

export const LongDelay = () => <Delayed delay={30000} />;
LongDelay.storyName = 'LongDelay (should fail with timeout)';
LongDelay.parameters = {
  axe: {
    waitForSelector: '#the-tab',
  },
};
