import { z as zod } from 'zod';

const skipSchema = zod.optional(zod.boolean());
const disabledRulesSchema = zod.optional(zod.array(zod.string()));
const waitForSelectorSchema = zod.optional(zod.string());

export function parseSkip(skipped?: unknown): zod.infer<typeof skipSchema> {
  return skipSchema.parse(skipped);
}

export function parseDisabledRules(disabledRules?: unknown): zod.infer<typeof disabledRulesSchema> {
  return disabledRulesSchema.parse(disabledRules);
}

export function parseWaitForSelector(waitForSelector?: unknown): zod.infer<typeof waitForSelectorSchema> {
  return waitForSelectorSchema.parse(waitForSelector);
}
