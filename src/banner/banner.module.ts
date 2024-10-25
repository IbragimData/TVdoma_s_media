import { Module } from '@nestjs/common';
import { BannerService } from './banner.service';
import { BannerController } from './banner.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { MediaService } from 'src/media/media.service';
import { S3Service } from 'src/s3/s3.service';
import { FilmService } from 'src/film/film.service';

@Module({
  providers: [BannerService, PrismaService, S3Service, FilmService],
  controllers: [BannerController]
})
export class BannerModule {}
