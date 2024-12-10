import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createContentDto, updateContentDto } from './dto';
import { S3Service } from 'src/s3/s3.service';
import { v4 } from 'uuid';
import { filterContentDto } from './dto/filterContent.dto';

@Injectable()
export class ContentService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly s3Service: S3Service,
  ) {}

  async getMany(dto: filterContentDto) {
    const where: any = {};

    if(dto.type){
      where.type = dto.type
    }

    if (dto.genre) {
      const genre = await this.prismaService.genre.findFirst({
        where: {
          title: dto.genre,
        },
      });
      if(!genre){
        throw new BadRequestException()
      }
      where.genres = {
        some: {
          id: genre.id,
        },
      };
    }

    if(dto.releaseDate){
      where.releaseDate = dto.releaseDate
    }
    const pageSize = 15
    const skip = (dto.page - 1) * pageSize

    const movies = await this.prismaService.content.findMany({
      where,
      take: pageSize,
      skip
    })

    const totalMovie = await this.prismaService.content.count({
      where
    })

    return {
      movies,
      totalPages: Math.ceil(totalMovie / pageSize)
    }
    
  }

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
  ) {
    const content = await this.getContentByUrl(dto.url);
    if (content) {
      throw new BadRequestException();
    }
    return await this.prismaService.content.create({
      data: {
        ...dto
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
    media: string,
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



}
