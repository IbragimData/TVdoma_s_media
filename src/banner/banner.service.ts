import { BadRequestException, Injectable } from '@nestjs/common';
import { connect } from 'http2';
import { MediaService } from 'src/media/media.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { S3Service } from 'src/s3/s3.service';

@Injectable()
export class BannerService {
    constructor(
        private readonly s3Service:S3Service,
        private readonly prismaService:PrismaService        
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
}
