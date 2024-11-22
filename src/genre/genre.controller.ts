import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { GenreService } from './genre.service';
import { genreDto } from './dto/genre.dto';


@Controller('genre')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Get()
  async getAllGenres() {
    return this.genreService.getAllGenres();
  }

  @Get(':id')
  async getGenreById(@Param('id') id: number) {
    return this.genreService.getGenreById(id);
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
