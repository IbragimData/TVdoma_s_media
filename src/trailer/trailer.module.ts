import { Module } from '@nestjs/common';
import { TrailerService } from './trailer.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ContentService } from 'src/content/content.service';
import { S3Service } from 'src/s3/s3.service';
import { TrailerController } from './trailer.controller';

@Module({
  providers: [TrailerService, PrismaService, ContentService, S3Service],
  controllers: [TrailerController]
})
export class TrailerModule {}
