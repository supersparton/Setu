import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthController {
  /**
   * Cloud Run's startup probe hits this. Plain 200 text, no JSON envelope, so a
   * failure here is unambiguous in the deploy log rather than buried in a body.
   */
  @Get('healthz')
  healthz(): string {
    return 'ok';
  }
}
