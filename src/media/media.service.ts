import { BadRequestException, Injectable } from '@nestjs/common';
import { ContentService } from 'src/content/content.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { S3Service } from 'src/s3/s3.service';
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
    return await this.prismaService.content.update({
        where: {
            id: content.id
        },
        data: {
            media: resUpload
        }
    })
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
}
