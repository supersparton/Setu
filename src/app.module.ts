import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { SchemaController } from './schema.controller';

/**
 * Phase 0 scaffold. Only the two endpoints that must exist before anything else:
 * a health probe Cloud Run can call, and /api/schema so the frontend reads the
 * contracts instead of hand-rolling types (INSTRUCTIONS.md 8).
 */
@Module({
  controllers: [HealthController, SchemaController],
})
export class AppModule {}
