import { Module } from '@nestjs/common';
import { PosterService } from './poster.service';
import { PosterController } from './poster.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { S3Service } from 'src/s3/s3.service';
import { ContentService } from 'src/content/content.service';

@Module({
  providers: [PosterService, PrismaService, S3Service, ContentService],
  controllers: [PosterController]
})
export class PosterModule {}
