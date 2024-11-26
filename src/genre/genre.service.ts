import { BadRequestException, Get, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { genreDto } from './dto';
import { ContentService } from 'src/content/content.service';

@Injectable()
export class GenreService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly contentService: ContentService,
  ) {}

  async getAllGenres() {
    return this.prismaService.genre.findMany();
  }

  async getGenreById(title: string) {
    return this.prismaService.genre.findUnique({ where: { title } });
  }

  async createGenre(genreDto: genreDto) {
    const genre = await this.prismaService.genre.findFirst({
        where: {
            title: genreDto.title
        }
    })
    if(genre){
        throw new BadRequestException()
    }
    return this.prismaService.genre.create({ data: { title: genreDto.title } });
  }

  async updateGenre(id: number, genreDto: genreDto) {
    return this.prismaService.genre.update({
      where: { id },
      data: { title: genreDto.title },
    });
  }

  async deleteGenre(id: number) {
    return this.prismaService.genre.delete({ where: { id } });
  }
  async addMultipleGenresToContent(contentId: number, genreIds: number[]) {

    const content = await this.contentService.getContentById(contentId)
    if (!content) {
      throw new BadRequestException();
    }
  
    // Проверяем существование всех жанров
    const genres = await this.prismaService.genre.findMany({
      where: { id: { in: genreIds } },
    });
  
    if (genres.length !== genreIds.length) {
      throw new BadRequestException()
    }
  
    // Добавляем множество жанров к контенту
    return this.prismaService.content.update({
      where: { id: contentId },
      data: {
        genres: {
          connect: genreIds.map((id) => ({ id })),
        },
      },
      include: {
        genres: true, // Возвращаем обновлённый список жанров
      },
    });
  }

  async deleteGenreFromContent(contentId: number, genreId: number) {
    const content = await this.contentService.getContentById(contentId);
  
    if (!content) {
      throw new BadRequestException;
    }
  
    const genre = await this.prismaService.genre.findUnique({ where: { id: genreId } });
  
    if (!genre) {
      throw new BadRequestException();
    }
  
    // Проверяем, что жанр связан с контентом
    const isGenreLinked = content.genres.some((g) => g.id === genreId);
    if (!isGenreLinked) {
      throw new BadRequestException();
    }
  

    return this.prismaService.content.update({
      where: { id: contentId },
      data: {
        genres: {
          disconnect: {id: genreId}
        },
      },
      include: {
        genres: true
      },
    });
  }
}
