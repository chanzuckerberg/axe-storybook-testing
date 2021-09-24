import { z as zod } from 'zod';

const skipSchema = zod.optional(zod.boolean());
const disabledRulesSchema = zod.optional(zod.array(zod.string()));
const waitForSelectorSchema = zod.optional(zod.string());

export function parseSkip(skipped: unknown | undefined, errorMessage: string): zod.infer<typeof skipSchema> {
  return parseWithFriendlyError(
    () => skipSchema.parse(skipped),
    errorMessage,
  );
}

export function parseDisabledRules(disabledRules: unknown | undefined, errorMessage: string): zod.infer<typeof disabledRulesSchema> {
  return parseWithFriendlyError(
    () => disabledRulesSchema.parse(disabledRules),
    errorMessage,
  );
}

export function parseWaitForSelector(waitForSelector: unknown | undefined, errorMessage: string): zod.infer<typeof waitForSelectorSchema> {
  return parseWithFriendlyError(
    () => waitForSelectorSchema.parse(waitForSelector),
    errorMessage,
  );
}

function parseWithFriendlyError<T>(parser: () => T, errorMessage: string): T {
  try {
    return parser();
  } catch (message) {
    if (message instanceof zod.ZodError) {
      throw new TypeError(errorMessage);
    } else {
      throw message;
    }
  }
}
