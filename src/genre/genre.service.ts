import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { genreDto } from './dto/genre.dto';
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

  async getGenreById(id: number) {
    return this.prismaService.genre.findUnique({ where: { id } });
  }

  async createGenre(genreDto: genreDto) {
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
}
