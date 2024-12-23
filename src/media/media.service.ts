import { BadRequestException, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { ContentService } from 'src/content/content.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { S3Service } from 'src/s3/s3.service';
import { Stream } from 'stream';
import { v4 } from 'uuid';

@Injectable()
export class MediaService {
  constructor(
    private readonly s3Service: S3Service,
    private readonly prismaService: PrismaService,
    private readonly contentService: ContentService,
  ) {}

  async uploadMedia(
    file: Express.Multer.File,
    bucker: string,
    contentId: number,
  ) {
    console.log('upload ===== start');
    const content = await this.contentService.getContentById(contentId);
    if (!content) {
      throw new BadRequestException();
    }

    if (content.media) {
      await this.deleteMedia(content.id, bucker);
    }

    const key = v4();
    const _key = await this.s3Service.upload(file, bucker, 'media/' + key);
    const resUpload = _key.key.substring(6);
    console.log('upload ===== end');
    return await this.prismaService.content.update({
      where: {
        id: content.id,
      },
      data: {
        media: resUpload,
      },
    });
  }

  async updateMedia(
    file: Express.Multer.File,
    bucker: string,
    contentId: number,
  ) {
    const content = await this.contentService.getContentById(contentId);
    if (!content) {
      throw new BadRequestException();
    }

    if (content.media) {
      await this.deleteMedia(content.id, bucker);
    }

    return await this.uploadMedia(file, bucker, content.id);
  }

  async deleteMedia(id: number, bucker: string) {
    const content = await this.contentService.getContentById(id);
    if (!content) {
      throw new BadRequestException();
    }

    if (!content.media) {
      return content;
    }

    await this.s3Service.deleteFile(bucker, 'media/' + content.media);
    return await this.prismaService.content.update({
      where: {
        id,
      },
      data: {
        media: null,
      },
    });
  }

  async getMediaFile(bucket: string, key: string, res: Response) {
    const range = res.req.headers.range;
    const fileKey = `media/${key}`;

    if (range) {
      const file = await this.s3Service.getFileMedia(bucket, fileKey, range);

      const contentLength = parseInt(file.ContentLength?.toString() || '0', 10);
      const totalSize = parseInt(file.ContentRange?.split('/')[1] || '0', 10);

      const [start, end] = range
        .replace(/bytes=/, '')
        .split('-')
        .map((value) => parseInt(value, 10));

      res.status(206);
      res.set({
        'Content-Type': file.ContentType,
        'Content-Length': contentLength,
        'Accept-Ranges': 'bytes',
        'Content-Range': `bytes ${start}-${end || totalSize - 1}/${totalSize}`,
      });

      (file.Body as Stream).pipe(res); // Передаем поток данных клиенту
    } else {
      // Обработка полного файла
      const file = await this.s3Service.getFileMedia(bucket, fileKey);

      res.set({
        'Content-Type': file.ContentType,
        'Content-Length': file.ContentLength,
        'Accept-Ranges': 'bytes', // Указываем, что поддерживаются диапазоны
      });

      (file.Body as Stream).pipe(res); // Передаем поток данных клиенту
    }
  }
}
