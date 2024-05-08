import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ICorsConfig } from './lib/types';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { MicroServicesExceptionFilter } from './exceptions/exceptionFilter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  // cors config
  const corsConfig = configService.get<ICorsConfig>('CORS_OPTIONS');
  app.enableCors(corsConfig);

  // global path prefix and versioning
  app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v1',
  });

  // global validation pipe
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.use(cookieParser());

  // ======= MICROSERVICES ========== //

  const user = configService.get('RABBITMQ_USER');
  const password = configService.get('RABBITMQ_PASSWORD');
  const host = configService.get('RABBITMQ_HOST');
  const queueName = configService.get('RABBITMQ_QUEUE_NAME');

  app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${user}:${password}@${host}`],
        queue: queueName,
        queueOptions: {
          durable: true,
        },
      },
    },
    { inheritAppConfig: true },
  );

  // register microservices exception filter
  app.useGlobalFilters(new MicroServicesExceptionFilter());

  await app.startAllMicroservices();

  // get config
  const port = configService.get('PORT') || 3001;

  await app.listen(port);
  console.log(`API Server is listening on port ${port}`);
}

bootstrap();
