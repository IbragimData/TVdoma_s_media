import { BadRequestException, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { ContentService } from 'src/content/content.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { S3Service } from 'src/s3/s3.service';
import { Stream } from 'stream';
import { v4 } from 'uuid';

@Injectable()
export class PosterService {
    constructor(
        private readonly s3Service:S3Service,
        private readonly prismaService:PrismaService,
        private readonly contentService:ContentService
    ){}

    async uploadPoster(file:Express.Multer.File, bucker:string, contentId:number){

        const content = await this.contentService.getContentById(contentId)
        if(!content){
            throw new BadRequestException()
        }
        if(content.banner){
            await this.deletePoster(bucker, content.id)
        }
        const key = v4()

        const _key = await this.s3Service.upload(file, bucker, "poster/" + key)
        const resUpload =  _key.key.substring(7)
        return await this.prismaService.content.update({
            where: {
                id: content.id
            },
            data: {
                poster: resUpload
            }
        })
    }

    async deletePoster(bucker:string, id:number){
        const content = await this.contentService.getContentById(id)
        if(!content){
            throw new BadRequestException()
        }

        await this.s3Service.deleteFile(bucker, "poster/" + content.poster)
        
        return this.prismaService.content.update({
            where: {
                id: content.id
            },
            data: {
                poster: null
            }
        })
    }

    async getPosterFile(bucker:string, key: string, res:Response){
        const file = await this.s3Service.getFile(bucker, "poster/" + key);
        
        // Устанавливаем заголовки для файла
        res.set({
          'Content-Type': file.ContentType,
          'Content-Length': file.ContentLength,
        });
        // Передаем поток данных в response
        (file.Body as Stream).pipe(res);
    }

    async updatePoster(id:number, bucker: string, file:Express.Multer.File){
        const content = await this.contentService.getContentById(id)
        if(!content){
            throw new BadRequestException()
        }

        if(content.poster){
            await this.deletePoster(bucker, content.id)
        }

        const key = await this.uploadPoster(file, bucker, content.id)
        return key
    }

}
