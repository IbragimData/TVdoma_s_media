import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { MediaModule } from './media/media.module';
import { BannerModule } from './banner/banner.module';
import { S3Module } from './s3/s3.module';
import { FilmMediaModule } from './film-media/film-media.module';
import { ContentModule } from './content/content.module';
import { SeasonModule } from './season/season.module';
import { EpisodeModule } from './episode/episode.module';

@Module({
  imports: [PrismaModule, ConfigModule.forRoot({
    isGlobal: true
  }), MediaModule, BannerModule, S3Module, FilmMediaModule, ContentModule, SeasonModule, EpisodeModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
