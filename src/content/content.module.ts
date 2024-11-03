import { Module } from '@nestjs/common';
import { ContentService } from './content.service';
import { ContentController } from './content.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { SeasonService } from 'src/season/season.service';
import { S3Service } from 'src/s3/s3.service';
import { BannerService } from 'src/banner/banner.service';
import { PosterService } from 'src/poster/poster.service';

@Module({
  providers: [ContentService, PrismaService, SeasonService, S3Service, BannerService, PosterService],
  controllers: [ContentController]
})
export class ContentModule {}
