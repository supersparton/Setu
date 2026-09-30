import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { logger: ['log', 'warn', 'error'] });

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.enableCors();

  const port = Number(process.env.PORT ?? 8080);
  // 0.0.0.0 is required: Cloud Run probes the container, not loopback.
  await app.listen(port, '0.0.0.0');
  new Logger('Bootstrap').log(`Setu listening on 0.0.0.0:${port}`);
}

bootstrap().catch((err) => {
  new Logger('Bootstrap').error(err instanceof Error ? err.stack : String(err));
  process.exit(1);
});
