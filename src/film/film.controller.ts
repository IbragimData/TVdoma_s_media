import { BadRequestException, Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FilmService } from './film.service';
import { createFilmDto } from './dto/createFilm.dto';

@Controller('film')
export class FilmController {
    constructor(
        private readonly filmService:FilmService
    ){}
    @Get(":url")
    async getFilmByUrl(@Param("url") url:string){
        const film = await this.filmService.getFilmByUrl(url)
        if(!film){
            throw new BadRequestException()
        }
        return film
    }
    @Post()
    async createFilm(@Body() dto:createFilmDto){
        return await this.filmService.createFilm(dto)
    }
}
