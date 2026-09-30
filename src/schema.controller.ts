import { Controller, Get } from '@nestjs/common';
import { ALL_SCHEMAS, DEFAULT_WEIGHTS, SCORED_THEMES, SUPPORTED_LANGS, UNSCORED_THEMES, VINTAGE_REGISTER } from './shared/schema';

/**
 * The frontend fetches this instead of hand-writing types. A field rename here
 * breaks the contract test rather than silently drifting into the UI, which is
 * the failure mode INSTRUCTIONS.md 5 exists to prevent.
 */
@Controller('api')
export class SchemaController {
  @Get('schema')
  schema(): {
    contracts: Record<string, unknown>;
    scored_themes: readonly string[];
    unscored_themes: readonly string[];
    supported_langs: readonly string[];
    default_weights: typeof DEFAULT_WEIGHTS;
    vintages: typeof VINTAGE_REGISTER;
  } {
    return {
      contracts: ALL_SCHEMAS as unknown as Record<string, unknown>,
      scored_themes: SCORED_THEMES,
      unscored_themes: UNSCORED_THEMES,
      supported_langs: SUPPORTED_LANGS,
      default_weights: DEFAULT_WEIGHTS,
      vintages: VINTAGE_REGISTER,
    };
  }
}
