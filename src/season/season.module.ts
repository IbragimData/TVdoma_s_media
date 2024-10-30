import { Module } from '@nestjs/common';
import { SeasonService } from './season.service';
import { ContentService } from 'src/content/content.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { SeasonController } from './season.controller';
import { EpisodeService } from 'src/episode/episode.service';
import { S3Service } from 'src/s3/s3.service';

@Module({
  providers: [SeasonService, ContentService, PrismaService, EpisodeService, S3Service],
  controllers: [SeasonController]
})
export class SeasonModule {}
