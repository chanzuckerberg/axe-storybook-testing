import type { Page } from 'playwright';
import type { ProcessedStory } from './ProcessedStory';

/**
 * Abuse Storybook's internal APIs to render a story without requiring a page reload.
 *
 * Doing so is brittle, and updates to Storybook could break this. The trade off is that we don't
 * have to figure out how to process stories with Webpack - Storybook handles that for us.
 */
export async function showStory(page: Page, story: ProcessedStory): Promise<void> {
  await page.evaluate((id: string) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore This function executes in a browser context.
    const storybookClientApi = window.__STORYBOOK_CLIENT_API__;

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
  }, story.storybookId);
}
