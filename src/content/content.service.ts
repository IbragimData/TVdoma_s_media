import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createContentDto, updateContentDto } from './dto';
import { S3Service } from 'src/s3/s3.service';
import { v4 } from 'uuid';

@Injectable()
export class ContentService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly s3Service: S3Service,
  ) {}

  async getContentById(id: number) {
    return await this.prismaService.content.findFirst({
      where: {
        id,
      },
      include: {
        genres: true,
      },
    });
  }

  async getContentByUrl(url: string) {
    return await this.prismaService.content.findFirst({
      where: {
        url,
      },
      include: {
        genres: true,
      },
    });
  }

  async createContent(
    dto: createContentDto,
    banner: string,
    poster: string,
    media: string,
    titleImage: string,
    trailer: string,
  ) {
    const content = await this.getContentByUrl(dto.url);
    console.log(dto);
    if (content) {
      throw new BadRequestException();
    }
    return await this.prismaService.content.create({
      data: {
        ...dto,
        banner,
        poster,
        media,
        titleImage,
        trailer,
      },
    });
  }

  async updateContent(
    dto: updateContentDto,
    url: string,
    banner: string,
    trailer: string,
    titleImage: string,
    poster: string,
    media,
  ) {
    const content = await this.getContentByUrl(url);
    if (!content) {
      throw new BadRequestException();
    }

    if (dto.url) {
      const validUrl = await this.prismaService.content.findFirst({
        where: {
          url: dto.url,
          id: { not: content.id },
        },
      });
      if (validUrl) {
        throw new BadRequestException();
      }
    }

    return await this.prismaService.content.update({
      where: {
        id: content.id,
      },
      data: {
        ...dto,
        banner,
        trailer,
        titleImage,
        poster,
        media,
      },
    });
  }

  async deleteContent(url: string) {
    const content = await this.getContentByUrl(url);
    if (!content) {
      throw new BadRequestException();
    }

    return await this.prismaService.content.delete({
      where: {
        id: content.id,
      },
      select: {
        id: true,
      },
    });
  }

  async uploadMedia(file: Express.Multer.File, bucker: string) {
    const key = v4();
    const _key = await this.s3Service.upload(file, bucker, 'media/' + key);
    const resUpload = _key.key.substring(6);
    return resUpload;
  }

  async deleteMedia(id: number, bucker: string) {
    const content = await this.getContentById(id);
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

  async updateMedia(id: number, bucker: string, file: Express.Multer.File) {
    const content = await this.getContentById(id);
    if (!content) {
      throw new BadRequestException();
    }

    if (content.media) {
      await this.deleteMedia(content.id, bucker);
    }

    return await this.uploadMedia(file, bucker);
  }
}
