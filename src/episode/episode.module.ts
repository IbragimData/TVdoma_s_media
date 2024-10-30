import { Module } from '@nestjs/common';
import { EpisodeService } from './episode.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { SeasonService } from 'src/season/season.service';
import { ContentService } from 'src/content/content.service';
import { S3Service } from 'src/s3/s3.service';
import { EpisodeController } from './episode.controller';

@Module({
  providers: [EpisodeService, PrismaService, SeasonService, ContentService, S3Service],
  controllers: [EpisodeController]
})
export class EpisodeModule {}
