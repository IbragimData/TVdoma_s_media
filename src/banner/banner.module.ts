import { Module } from '@nestjs/common';
import { BannerService } from './banner.service';
import { BannerController } from './banner.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { MediaService } from 'src/media/media.service';

@Module({
  providers: [BannerService, PrismaService, MediaService],
  controllers: [BannerController]
})
export class BannerModule {}
