import type { Page } from 'playwright';
import type { ProcessedStory } from './ProcessedStory';
import type { ClientApi, StoreItem } from '@storybook/client-api';

/**
 * Storybook's internal representation of a story.
 */
export type StorybookStory = Pick<StoreItem, 'id' | 'kind' | 'name' | 'parameters'>;

/**
 * Get the list of stories from a static storybook build.
 */
export async function getStories(page: Page): Promise<StorybookStory[]> {
  const rawStories = await page.evaluate(fetchStoriesFromWindow);

  if (!rawStories) {
    throw new Error('Storybook object not found on window. Open your storybook and check the console for errors.');
  }

  return rawStories;
}

/**
 * Render a story on a Storybook page.
 */
export async function showStory(page: Page, story: ProcessedStory): Promise<void> {
  await page.evaluate(emitSetCurrentStory, story.storybookId);
}

/**
 * Get a list of stories from Storybook's internal API.
 *
 * Executes in a browser context.
 */
function fetchStoriesFromWindow(): Promise<StoreItem[]> {
  return new Promise((resolve, reject) => {
    // Check if the window has stories every 100ms for up to 10 seconds.
    // This allows 10 seconds for any async pre-tasks (like fetch) to complete.
    // Usually stories will be found on the first loop.
    function checkStories(timesCalled: number) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore This function executes in a browser context.
      const storybookClientApi = window.__STORYBOOK_CLIENT_API__ as ClientApi;

      if (storybookClientApi) {
        resolve(storybookClientApi.raw());
      } else if (timesCalled < 100) {
        // Stories not found yet, try again 100ms from now
        setTimeout(() => {
          checkStories(timesCalled + 1);
        }, 100);
      } else {
        reject(new Error(
          'Storybook object not found on window. ' +
          'Open your storybook and check the console for errors.',
        ));
      }
    }

    checkStories(0);
  });
}

/**
 * Abuse Storybook's internal APIs to render a story without requiring a page reload (which would
 * be slow).
 *
 * Doing so is brittle, and updates to Storybook could break this. The trade off is that we don't
 * have to figure out how to process stories with Webpack - Storybook handles that for us.
 *
 * Executes in a browser context.
 */
function emitSetCurrentStory(id: string) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore This function executes in a browser context.
  const storybookClientApi = window.__STORYBOOK_CLIENT_API__ as ClientApi;

  if (!storybookClientApi) {
    return Promise.reject(new Error("Storybook doesn't seem to be running on the page"));
  }

  const store = storybookClientApi.store();

  store._channel.emit('setCurrentStory', {
    storyId: id,
    viewMode: 'story',
    options: {
      target: 'storybook-preview-iframe',
    },
  });

  return new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
}
