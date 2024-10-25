import { BadRequestException, Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { FilmService } from './film.service';
import { createFilmDto } from './dto/createFilm.dto';
import { updateFilmDto } from './dto/updateFilm.dto';

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

    @Patch(":url")
    updateFilm(@Body() dto:updateFilmDto, @Param("url") url:string){
        return this.filmService.updateFilm(dto, url)
    }

    @Post()
    async createFilm(@Body() dto:createFilmDto){
        return await this.filmService.createFilm(dto)
    }
}
