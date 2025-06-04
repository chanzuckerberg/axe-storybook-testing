import type {PreviewWeb} from 'storybook/preview-api';
import type {
  Renderer,
  StoryIdentifier,
  Parameters,
} from 'storybook/internal/types';
import pTimeout from 'p-timeout';
import type {Page} from 'playwright';
import dedent from 'ts-dedent';

// Functions we pass to `page.evaluate` execute in a browser environment, and can access window.
// eslint-disable-next-line no-var
declare var window: {
  __STORYBOOK_PREVIEW__: PreviewWeb<Renderer>;
};

/**
 * Storybook's internal representation of a story.
 */
type Story = StoryIdentifier & {
  parameters: Parameters;
};

/**
 * Story with only the attributes we need.
 */
export type StorybookStory = Pick<
  Story,
  'id' | 'title' | 'name' | 'parameters'
>;

/**
 * Get the list of stories from a static storybook build.
 */
export async function getStories(page: Page): Promise<StorybookStory[]> {
  const rawStories = await pTimeout(
    page.evaluate(fetchStoriesFromWindow),
    10_000,
  ).catch((e) => {
    throw new Error(dedent`
      Stories could not be retrieved from storybook!

      Please check that...
      - You're using a compatible version of Storybook
      - Storybook doesn't have any errors

      Otherwise this is likely a bug with axe-storybook-testing.

      Original error message: ${e}
    `);
  });

  return rawStories;
}

/**
 * Render a story on a Storybook page.
 */
export function showStory(page: Page, id: string) {
  return page.evaluate(emitSetCurrentStory, id);
}

/**
 * Get a list of stories from Storybook's internal API.
 *
 * Executes in a browser context.
 */
async function fetchStoriesFromWindow(): Promise<StorybookStory[]> {
  const storybookPreview = window.__STORYBOOK_PREVIEW__;

  if (!storybookPreview) {
    return Promise.reject(
      new Error(
        'Storybook preview not found. Is Storybook running, and is it at least v7?',
      ),
    );
  }

  await storybookPreview.ready();

  const storyIndex = await storybookPreview.extract();
  const stories = Object.values(storyIndex);

  return stories.map(pickOnlyNecessaryAndSerializableStoryProperties);

  // Pick only the properties we need from Storybook's representation of a story.
  //
  // This is necessary because Playwright's `page.evaluate` requires return values to be JSON
  // serializable, so we need to make sure there are no non-serializable things in this object.
  // There's no telling what Storybook addons people are using, and whether their parameters are
  // serializable or not.
  //
  // See https://github.com/chanzuckerberg/axe-storybook-testing/issues/44 for a bug caused by this.
  function pickOnlyNecessaryAndSerializableStoryProperties(
    story: Story,
  ): StorybookStory {
    return {
      id: story.id,
      name: story.name,
      title: story.title,
      parameters: {
        axe: story.parameters.axe,
      },
    };
  }
}

/**
 * Abuse Storybook's internal APIs to render a story without requiring a page reload (which would
 * be slow). Also set up globals for any values needed for the running tests.
 *
 * Doing so is brittle, and updates to Storybook could break this. The trade off is that we don't
 * have to figure out how to process stories with Webpack - Storybook handles that for us.
 *
 * Executes in a browser context.
 */
function emitSetCurrentStory(id: string) {
  const storybookPreview = window.__STORYBOOK_PREVIEW__;

  if (!storybookPreview) {
    return Promise.reject(
      new Error(
        'Storybook preview not found. Is Storybook running, and is it at least v7?',
      ),
    );
  }

  // @ts-expect-error Access the protected "channel", so we can send stuff through it.
  const channel = storybookPreview.channel;

  // update global to disable known addons containing `axe-core`
  channel.emit('updateGlobals', {
    globals: {
      a11y: {
        manual: true,
      },
    },
  });

  return new Promise((resolve) => {
    channel.emit('setCurrentStory', {
      storyId: id,
      viewMode: 'story',
      options: {
        target: 'storybook-preview-iframe',
      },
    });

    channel.once('storyRendered', resolve);
  });
}
