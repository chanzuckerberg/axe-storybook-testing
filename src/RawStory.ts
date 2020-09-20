import type { Page } from 'playwright';

/**
 * Storybook's internal representation of a story. Has only the properties we need.
 */
export type RawStory = {
  id?: string;
  kind: string;
  name: string;
  parameters?: {
    axe?: {
      disabled?: unknown;
      disabledRules?: unknown;
    };
  };
}

/**
 * Get the list of stories from a static storybook build.
 *
 * Works by opening Storybook's iframe and reading data Storybook attaches to the window.
 */
export async function fromPage(page: Page): Promise<RawStory[]> {
  const rawStories = await page.evaluate(fetchStoriesFromWindow);

  if (!rawStories) {
    throw new Error('Storybook object not found on window. Open your storybook and check the console for errors.');
  }

  return rawStories;
}

function fetchStoriesFromWindow(): Promise<RawStory[]> {
  return new Promise((resolve, reject) => {
    const storybookClientAPIKey = '__STORYBOOK_CLIENT_API__';

    // Check if the window has stories every 100ms for up to 10 seconds.
    // This allows 10 seconds for any async pre-tasks (like fetch) to complete.
    // Usually stories will be found on the first loop.
    function checkStories(timesCalled: number) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore This function executes in a browser context.
      if (window[storybookClientAPIKey]) {
        // Found the stories, sanitize to name, kind, and options, and then return them.
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore This function executes in a browser context.
        const reducedStories = window[storybookClientAPIKey].raw().map(story => ({
          id: story.id,
          name: story.name,
          kind: story.kind,
          parameters: { axe: story.parameters ? story.parameters.axe : undefined },
        }));
        resolve(reducedStories);
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
