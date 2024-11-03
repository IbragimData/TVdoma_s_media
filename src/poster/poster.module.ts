import { Module } from '@nestjs/common';
import { PosterService } from './poster.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { S3Service } from 'src/s3/s3.service';
import { ContentService } from 'src/content/content.service';
import { PosterController } from './poster.controller';

@Module({
  providers: [PosterService, PrismaService, S3Service, ContentService],
  controllers: [PosterController]
})
export class PosterModule {}
