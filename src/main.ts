import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(express.urlencoded({ limit: '5gb', extended: true }));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.use(bodyParser.json({ limit: '5gb' }));
  app.use(bodyParser.urlencoded({ limit: '5gb', extended: true }));
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
