import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { S3Service } from 'src/s3/s3.service';

@Module({
  controllers: [MediaController],
  providers: [S3Service]
})
export class MediaModule {}
