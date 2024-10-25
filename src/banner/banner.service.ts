import { BadRequestException, Injectable } from '@nestjs/common';
import { connect } from 'http2';
import { FilmService } from 'src/film/film.service';
import { MediaService } from 'src/media/media.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { S3Service } from 'src/s3/s3.service';

@Injectable()
export class BannerService {
    constructor(
        private readonly s3Service:S3Service,
        private readonly prismaService:PrismaService,
        private readonly filmService:FilmService      
    ){}

    async uploadBanner(url:string, file:Express.Multer.File, bucker:string, key:string){
        const content = await this.prismaService.content.findFirst({
            where: {
                url
            }
        })
        if(!content){
            throw new BadRequestException()
        }
        const _key = await this.s3Service.upload(file, bucker, key)
        return this.prismaService.content.update({
            where: {
                url
            },
            data: {
                banner: _key.key
            }
        })
    }
    
    async deleteBanner(bucker:string, url:string){
        const content = await this.filmService.getFilmByUrl(url)
        if(!content){
            throw new BadRequestException()
        }
        if(!content.banner){
            return content
        }
        
        await this.s3Service.deleteFile(bucker, content.banner)
        
        return this.prismaService.content.update({
            where: {
                id: content.id
            },
            data: {
                banner: null
            }
        })
    }
}
