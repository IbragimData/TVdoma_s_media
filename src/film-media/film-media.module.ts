import { Module } from '@nestjs/common';
import { FilmMediaService } from './film-media.service';
import { FilmMediaController } from './film-media.controller';
import { S3Service } from 'src/s3/s3.service';

@Module({
  providers: [FilmMediaService, S3Service],
  controllers: [FilmMediaController]
})
export class FilmMediaModule {}
