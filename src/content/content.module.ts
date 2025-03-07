import { Module } from '@nestjs/common';
import { ContentService } from './content.service';
import { ContentController } from './content.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { SeasonService } from 'src/season/season.service';
import { S3Service } from 'src/s3/s3.service';
import { BannerService } from 'src/banner/banner.service';
import { PosterService } from 'src/poster/poster.service';
import { TitleImageService } from 'src/title-image/title-image.service';
import { TrailerService } from 'src/trailer/trailer.service';
import { GenreService } from 'src/genre/genre.service';
import { MediaService } from 'src/media/media.service';

@Module({
  providers: [ContentService, PrismaService, SeasonService, S3Service, BannerService, PosterService, TitleImageService, TrailerService, GenreService, MediaService],
  controllers: [ContentController]
})
export class ContentModule {}
