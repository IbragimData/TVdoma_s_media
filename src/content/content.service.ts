import { BadRequestException, Injectable, RequestTimeoutException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createContentDto, updateContentDto } from './dto';
import { filterContentDto } from './dto/filterContent.dto';

@Injectable()
export class ContentService {
  constructor(private readonly prismaService: PrismaService) { }

  async getMany(dto: filterContentDto) {
    const where: any = {};
    console.log(dto)

    if (dto.type) {
      where.type = dto.type;
    }

    if (dto.genre) {
      const genre = await this.prismaService.genre.findFirst({
        where: {
          title: dto.genre,
        },
      });
      if (!genre) {
        throw new BadRequestException();
      }
      where.genres = {
        some: {
          id: genre.id,
        },
      };
    }

    if (dto.releaseDate) {
      where.releaseDate = dto.releaseDate;
    }
    const pageSize = 15;
    const skip = (dto.page - 1) * pageSize;

    const movies = await this.prismaService.content.findMany({
      where,
      take: pageSize,
      skip,
    });

    const totalMovie = await this.prismaService.content.count({
      where,
    });

    return {
      movies,
      totalPages: Math.ceil(totalMovie / pageSize),
    };
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
    });
  }

  async getRandomContent() {
    return this.prismaService.content.findMany({
      orderBy: {
        id: "desc"
      },
      take: 10,
      include: {
        genres: true
      }
    })
  }

  async createContent(dto: createContentDto) {
    const content = await this.getContentByUrl(dto.url);
    if (content) {
      throw new BadRequestException();
    }
    return await this.prismaService.content.create({
      data: {
        ...dto,
      },
    });
  }

  async updateContent(dto: updateContentDto, url: string) {
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
        banner: content.banner,
        poster: content.poster,
        media: content.media,
        titleImage: content.titleImage,
        trailer: content.trailer,
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

  async getGenreContentByUrl(url: string) {
    const content = await this.prismaService.content.findFirst({
      where: {
        url,
      },
      include: {
        genres: true,
      },
    });
    if (!content) {
      throw new BadRequestException();
    }
    return content;
  }

  searchContent = async (query: string) => {
    return this.prismaService.content.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { originalTitle: { contains: query, mode: "insensitive" } },
          { shortDescription: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { country: { contains: query, mode: "insensitive" } },
          { mainGenre: { contains: query, mode: "insensitive" } },
          {
            genres: {
              some: {
                title: { contains: query, mode: "insensitive" },
                rusTitle: { contains: query, mode: "insensitive" }
              }
            }
          }
        ]
      }
    });
  };

}
