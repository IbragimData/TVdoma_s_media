import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import { FilmService } from './film.service';

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
}
