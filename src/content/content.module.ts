import { Module } from '@nestjs/common';
import { ContentService } from './content.service';
import { ContentController } from './content.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { SeasonService } from 'src/season/season.service';

@Module({
  providers: [ContentService, PrismaService, SeasonService],
  controllers: [ContentController]
})
export class ContentModule {}
