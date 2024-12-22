import { Module } from '@nestjs/common';
import { GenreService } from './genre.service';
import { GenreController } from './genre.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ContentService } from 'src/content/content.service';
import { S3Service } from 'src/s3/s3.service';

@Module({
  providers: [GenreService, PrismaService, ContentService, S3Service],
  controllers: [GenreController],
})
export class GenreModule {}
