import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

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
}
