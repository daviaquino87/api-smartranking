import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { EnvService } from './env/env.service';
import { Request, Response } from 'express';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import * as momentTimezone from 'moment-timezone';

function enableDocumentation(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Smartranking API')
    .setDescription('Controllers for the smartranking API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}

function enableValidationPipes(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
}

function enableSecureApp(app: NestExpressApplication) {
  app.getHttpAdapter().getInstance().disable('x-powered-by');

  app.use((_req: Request, res: Response, next) => {
    res.header('Server', 'Smartranking server');
    next();
  });

  app.set('trust proxy', 1);
}

function enableExceptions(app: NestExpressApplication) {
  app.useGlobalFilters(new HttpExceptionFilter());
}

async function runServer(app: NestExpressApplication, port: number) {
  await app.listen(port);
}

async function useMomentTimezone() {
  Date.prototype.toJSON = function () {
    return momentTimezone(this)
      .tz('America/Sao_Paulo')
      .format('YYYY-MM-DD HH:mm:ss');
  };
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const env = app.get(EnvService);
  const PORT = env.get('PORT');
  const NODE_ENV = env.get('NODE_ENV');

  app.enableCors();

  if (NODE_ENV === 'development' || NODE_ENV === 'test') {
    enableDocumentation(app);
  }

  useMomentTimezone();
  enableSecureApp(app);
  enableValidationPipes(app);
  enableExceptions(app);
  runServer(app, PORT);
}
bootstrap();
