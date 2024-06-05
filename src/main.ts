import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { LoggerService } from './common/logger/logger.service';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.REDIS,
    options: {
      host: 'localhost',
      port: 6379,
    },
  });

  // Apply custom logger
  app.useLogger(new LoggerService());

  //Enable API Params ValidationPipe for all endpoint.
  app.useGlobalPipes(new ValidationPipe());

  await app.listen();
}
bootstrap();
