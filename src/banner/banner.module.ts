import { Module } from '@nestjs/common';
import { BannerService } from './banner.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { S3Service } from 'src/s3/s3.service';
import { ContentService } from 'src/content/content.service';
import { BannerController } from './banner.controller';
import { TitleImageService } from 'src/title-image/title-image.service';

@Module({
  providers: [BannerService, PrismaService, S3Service, ContentService, TitleImageService],
  controllers: [BannerController],
})
export class BannerModule {}
