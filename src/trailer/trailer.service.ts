import { BadRequestException, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { ContentService } from 'src/content/content.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { S3Service } from 'src/s3/s3.service';
import { Stream } from 'stream';
import { v4 } from 'uuid';

@Injectable()
export class TrailerService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly s3Service: S3Service,
    private readonly contentService: ContentService,
  ) {}

  async uploadTrailer(
    file: Express.Multer.File,
    bucker: string,
    contentId: number,
  ) {
    const content = await this.contentService.getContentById(contentId);
    if (!content) {
      throw new BadRequestException();
    }
    if (content.banner) {
      await this.deleteTrailer(bucker, content.id);
    }

    const key = v4();

    const _key = await this.s3Service.upload(file, bucker, 'trailer/' + key);
    const resUpload = _key.key.substring(8);
    return await this.prismaService.content.update({
      where: {
        id: content.id,
      },
      data: {
        trailer: resUpload,
      },
    });
  }

  async deleteTrailer(bucker: string, id: number) {
    const content = await this.contentService.getContentById(id);
    if (!content) {
      throw new BadRequestException();
    }

    await this.s3Service.deleteFile(bucker, 'trailer/' + content.trailer);

    return this.prismaService.content.update({
      where: {
        id: content.id,
      },
      data: {
        trailer: null,
      },
    });
  }

  async getTrailerFile(bucket: string, key: string, res: Response) {
    const range = res.req.headers.range; // Получаем заголовок Range
    const fileKey = `trailer/${key}`; // Полный ключ файла
    console.log(range)
    if (range) {
      // Обработка частичного контента
      const file = await this.s3Service.getFileMedia(bucket, fileKey, range);

      const contentLength = parseInt(file.ContentLength?.toString() || '0', 10);
      const totalSize = parseInt(file.ContentRange?.split('/')[1] || '0', 10);

      const [start, end] = range
        .replace(/bytes=/, '')
        .split('-')
        .map((value) => parseInt(value, 10));

      res.status(206); // HTTP статус для частичного контента
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

  async updateTrailer(id: number, bucker: string, file: Express.Multer.File) {
    const content = await this.contentService.getContentById(id);
    if (!content) {
      throw new BadRequestException();
    }

    if (content.trailer) {
      await this.deleteTrailer(bucker, content.id);
    }

    const key = await this.uploadTrailer(file, bucker, content.id);
    return key;
  }
}
