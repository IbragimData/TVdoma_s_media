import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createFilmDto } from './dto/createFilm.dto';

@Injectable()
export class FilmService {
    constructor(
        private readonly prismaService:PrismaService
    ){}

    async getFilmByUrl(url:string){
       return await this.prismaService.content.findFirst({
            where: {
                url
            }
        })
    }

    async createFilm(dto: createFilmDto){
        const film = await this.getFilmByUrl(dto.url)
        if(film){
            throw new BadRequestException()
        }
        return await this.prismaService.content.create({
            data: {
                ...dto
            }
        })
    }
}
