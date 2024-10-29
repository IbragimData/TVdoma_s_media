import { BadRequestException, Injectable } from '@nestjs/common';
import { ContentService } from 'src/content/content.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { S3Service } from 'src/s3/s3.service';
import { v4 } from 'uuid';

@Injectable()
export class PosterService {
    constructor(
        private readonly s3Service:S3Service,
        private readonly prismaService:PrismaService,
        private readonly contentService:ContentService
    ){}

    async uploadPoster(url:string, file:Express.Multer.File, bucker:string){
        const key = v4()
        const content = await this.prismaService.content.findFirst({
            where: {
                url
            }
        })

        if(!content){
            throw new BadRequestException()
        }

        const _key = await this.s3Service.upload(file, bucker, "poster/" + key)
        const resUpload =  _key.key.substring(7)
        return this.prismaService.content.update({
            where: {
                url
            },
            data: {
                poster: resUpload
            }
        })
    }

    async deletePoster(bucker:string, url:string){
        const content = await this.contentService.getContentByUrl(url)
        if(!content){
            throw new BadRequestException()
        }
        
        await this.s3Service.deleteFile(bucker, "poster/" + content.banner)
        
        return this.prismaService.content.update({
            where: {
                id: content.id
            },
            data: {
                poster: null
            }
        })
    }

}
