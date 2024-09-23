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

// Test out passing context to `axe.run`.
export const multipleParts = {
  render: () => (
    <div>
      <div id="a">
        <button style={{backgroundColor: 'red', color: 'hotpink'}}>
          hello A
        </button>
      </div>
      <div id="b">
        <button style={{backgroundColor: 'red', color: 'hotpink'}}>
          hello B
        </button>
      </div>
    </div>
  ),
  parameters: {
    axe: {
      context: '#a',
    },
  },
};
