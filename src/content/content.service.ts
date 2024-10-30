import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createContentDto, updateContentDto } from './dto';
import { S3Service } from 'src/s3/s3.service';


@Injectable()
export class ContentService {
    constructor(
        private readonly prismaService:PrismaService,
        private readonly s3Service:S3Service
    ){}

    async getContentByUrl(url:string){
       return await this.prismaService.content.findFirst({
            where: {
                url
            }
        })
    }

    async createContent(dto: createContentDto){
        const content = await this.getContentByUrl(dto.url)
        if(content){
            throw new BadRequestException()
        }
        return await this.prismaService.content.create({
            data: {
                ...dto
            }
        })
    }

    async updateContent(dto:updateContentDto, url:string){
        const content = await this.getContentByUrl(url)
        if(!content){
            throw new BadRequestException()
        }

        const validUrl = await this.prismaService.content.findFirst({
            where: {
                url: dto.url,
                id: {not: content.id}
            }
        })

        if(validUrl){
            throw new BadRequestException()
        }
       
        return await this.prismaService.content.update({
            where: {
                id: content.id
            },
            data: {
                ...dto
            }
        })
    }

    async deleteContent(url:string){
        const content = await this.getContentByUrl(url)
        if(!content){
            throw new BadRequestException()
        }


        return await this.prismaService.content.delete({
            where: {
                id: content.id
            },
            select: {
                id:true
            }
        })
    }

    async uploadFilm(file:Express.Multer.File, url:string, bucker:string, key:string){
        const content = await this.getContentByUrl(url)
        if(!content){
            throw new BadRequestException()
        }

        if(content.media){
            await this.deleteFilm(url, bucker)
        }
        
        const _key = await this.s3Service.upload(file, bucker, "media/" + key)
        const resUpload = _key.key.substring(6)
        return await this.prismaService.content.update({
            where: {
                url: content.url
            },
            data: {
                media: resUpload
            }
        })
    }

    async deleteFilm(url: string, bucker:string){
        const content = await this.getContentByUrl(url)
        if(!content){
            throw new BadRequestException()
        }

        if(!content.media){
            return content
        }

        await this.s3Service.deleteFile(bucker, "media/" + content.media)
        return await this.prismaService.content.update({
            where: {
                url
            },
            data: {
                media: null
            }
        })
    }
}
