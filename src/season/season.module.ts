import { Module } from '@nestjs/common';
import { SeasonService } from './season.service';
import { ContentService } from 'src/content/content.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [SeasonService, ContentService, PrismaService]
})
export class SeasonModule {}
