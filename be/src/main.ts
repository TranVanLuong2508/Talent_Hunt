import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SharedModule, ApiConfigService } from '@/shared';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Boostrap');

  const configService = app.select(SharedModule).get(ApiConfigService);
  const APP_PORT = configService.appConfig.port;

  await app.listen(APP_PORT || 3000);
  logger.warn(`Application is running on: http://localhost:${APP_PORT || 3000}`);
}
bootstrap();
