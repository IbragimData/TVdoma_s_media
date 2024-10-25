import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createFilmDto } from './dto/createFilm.dto';
import { updateFilmDto } from './dto/updateFilm.dto';

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

    async getAll(){
        return await this.prismaService.content.findMany()
    }

    async updateFilm(dto:updateFilmDto, url:string){
        const film = await this.getFilmByUrl(url)
        if(!film){
            throw new BadRequestException()
        }

        const validUrl = await this.prismaService.content.findFirst({
            where: {
                url: dto.url,
                id: {not: film.id}
            }
        })

        if(validUrl){
            throw new BadRequestException()
        }
       
        return await this.prismaService.content.update({
            where: {
                id: film.id
            },
            data: {
                ...dto
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
