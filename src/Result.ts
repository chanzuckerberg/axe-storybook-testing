import dedent from 'dedent';
import puppeteer from 'puppeteer';
import test from 'tape';
import { AxePuppeteer } from 'axe-puppeteer';
import type { Result as AxeResult } from 'axe-core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ProcessedStory } from './ProcessedStory';

type Result = {
  name: string;
  violations: AxeResult[];
};

/**
 * These rules aren't useful/helpful in the context of Storybook stories, and we disable them when
 * running Axe.
 */
const defaultDisabledRules = ['landmark-one-main', 'page-has-heading-one', 'region'];

/**
 * Run Axe on a browser page for each story.
 */
export async function fromStories(stories: ProcessedStory[], iframePath: string): Promise<Result[]> {
  const browser = await puppeteer.launch();

  try {
    const results = await Promise.all(
      stories.map(async (story) => {
        const page = await browser.newPage();

        try {
          await page.setBypassCSP(true);
          await page.goto(`file://${iframePath}?${story.uriParams}`);

          const disabledRules = defaultDisabledRules.concat(story.parameters.axe.disabledRules);
          const axeBuilder = new AxePuppeteer(page).disableRules(disabledRules);
          const result = await axeBuilder.analyze();

          return {
            name: story.name,
            violations: result.violations,
          };
        } finally {
          await page.close();
        }
      }),
    );

    return results;
  } finally {
    await browser.close();
  }
}

export function check(results: Result[]) {
  results.forEach((result) => {
    test(`${result.name} passes a11y checks`, (t) => {
      if (result.result.violations.length === 0) {
        t.pass('✅');
      } else {
        const message = result.result.violations.map(formatViolation).join('\n\n');
        t.fail(message);
      }
      t.end();
    });
  });
}

function formatViolation(violation: AxeResult): string {
  return dedent`
    ===================
    id: ${violation.id}
    description: ${violation.description}
    helpUrl: ${violation.helpUrl}
    help: ${violation.help}
    nodes: ${violation.nodes.map((node) => node.html).join('\n')}
  `;
}
