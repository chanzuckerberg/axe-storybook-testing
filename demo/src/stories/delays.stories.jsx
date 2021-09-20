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
function Delayed() {
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShow(true);
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, []);

  return show ? <NotDelayed /> : null;
}

export const NoDelay = () => <NotDelayed />;
NoDelay.storyName = 'NoDelay (should fail)';

export const Delay = () => <Delayed />;
Delay.storyName = 'Delay (should fail)';
Delay.parameters = {
  axe: {
    waitForSelector: '#the-tab',
  },
};
