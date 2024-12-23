import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Используем встроенные методы Express для загрузки больших файлов
  app.use(bodyParser.json({ limit: '5gb' }));
  app.use(bodyParser.urlencoded({ limit: '5gb', extended: true }));

  app.use((req, res, next) => {
    res.setTimeout(3600000, () => {
      // Установите 1 час (3600 секунд) на выполнение запроса
      console.log('Request has timed out');
      res.sendStatus(408); // Возвращаем код ошибки 408 (Request Timeout)
    });
    next();
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory);

  app.setGlobalPrefix('api');
  app.enableCors();

  await app.listen(5004);
}

bootstrap();
