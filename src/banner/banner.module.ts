import { Module } from '@nestjs/common';
import { BannerService } from './banner.service';
import { BannerController } from './banner.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { MediaService } from 'src/media/media.service';
import { S3Service } from 'src/s3/s3.service';

@Module({
  providers: [BannerService, PrismaService, S3Service],
  controllers: [BannerController]
})
export class BannerModule {}
