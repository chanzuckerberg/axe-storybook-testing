import { z as zod } from 'zod';

// Functions for validating parameters and providing default values.

export const ParamError = zod.ZodError;

const skipSchema = zod.boolean();
const disabledRulesSchema = zod.array(zod.string());
const waitForSelectorSchema = zod.optional(zod.string());

export function parseSkip(skipped: unknown): zod.infer<typeof skipSchema> {
  return skipSchema.optional().parse(skipped) || false;
}

export function parseDisabledRules(disabledRules: unknown): zod.infer<typeof disabledRulesSchema> {
  return disabledRulesSchema.optional().parse(disabledRules) || [];
}

export function parseWaitForSelector(waitForSelector: unknown): zod.infer<typeof waitForSelectorSchema> {
  return waitForSelectorSchema.parse(waitForSelector);
}
