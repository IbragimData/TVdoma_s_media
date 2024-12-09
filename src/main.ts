import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as express from "express"

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(express.json({limit: "50mb"}))
  app.use(express.urlencoded({limit: "50mb", extended: true}))
  app.useGlobalPipes(new ValidationPipe({
    transform: true
  }))
  const config = new DocumentBuilder()
  .setTitle('Cats example')
  .setDescription('The cats API description')
  .setVersion('1.0')
  .addTag('cats')
  .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory);
  app.setGlobalPrefix("api")
  await app.listen(5004);
}
bootstrap();
