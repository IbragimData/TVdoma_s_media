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
}
