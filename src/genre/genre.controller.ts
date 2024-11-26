import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { GenreService } from './genre.service';
import { genreDto } from './dto';


@Controller('genre')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Get()
  async getAllGenres() {
    return this.genreService.getAllGenres();
  }

  @Get(':genre')
  async getGenreById(@Param('genre') genre: string) {
    return this.genreService.getGenreById(genre);
  }

  @Post()
  async createGenre(@Body() genreDto: genreDto) {
    return this.genreService.createGenre(genreDto);
  }

  @Patch(':id')
  async updateGenre(@Param('id') id: number, @Body() genreDto: genreDto) {
    return this.genreService.updateGenre(id, genreDto);
  }

  @Delete(':id')
  async deleteGenre(@Param('id') id: number) {
    return this.genreService.deleteGenre(id);
  }
}
