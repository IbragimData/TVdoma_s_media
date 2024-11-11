import { Module } from '@nestjs/common';
import { TitleImageService } from './title-image.service';
import { TitleImageController } from './title-image.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { S3Service } from 'src/s3/s3.service';
import { ContentService } from 'src/content/content.service';

@Module({
  providers: [TitleImageService, PrismaService, S3Service, ContentService],
  controllers: [TitleImageController]
})
export class TitleImageModule {}
