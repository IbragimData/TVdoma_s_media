import { BadRequestException, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { ContentService } from 'src/content/content.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { S3Service } from 'src/s3/s3.service';
import { Stream } from 'stream';
import { v4 } from 'uuid';

@Injectable()
export class TrailerService {
    constructor(
        private readonly prismaService:PrismaService,
        private readonly s3Service:S3Service,
        private readonly contentService:ContentService
    ){}

    async uploadTrailer(file:Express.Multer.File, bucker:string, contentId:number){
        const content = await this.contentService.getContentById(contentId)
        if(!content){
            throw new BadRequestException()
        }
        if(content.banner){
            await this.deleteTrailer(bucker, content.id)
        }

        
        const key = v4()

        const _key = await this.s3Service.upload(file, bucker, "trailer/" + key)
        const resUpload =  _key.key.substring(8)
        return await this.prismaService.content.update({
            where: {
                id: content.id
            }, 
            data: {
                trailer: resUpload
            }
        })
    }

    async deleteTrailer(bucker:string, id:number){
        const content = await this.contentService.getContentById(id)
        if(!content){
            throw new BadRequestException()
        }

        await this.s3Service.deleteFile(bucker, "trailer/" + content.trailer)
        
        return this.prismaService.content.update({
            where: {
                id: content.id
            },
            data: {
                trailer: null
            }
        })
    }

    async getTrailerFile(bucker:string, key: string, res:Response){
        const file = await this.s3Service.getFile(bucker, "trailer/" + key);
        
        // Устанавливаем заголовки для файла
        res.set({
          'Content-Type': file.ContentType,
          'Content-Length': file.ContentLength,
        });
        // Передаем поток данных в response
        (file.Body as Stream).pipe(res);
    }

    async updateTrailer(id:number, bucker: string, file:Express.Multer.File){
        const content = await this.contentService.getContentById(id)
        if(!content){
            throw new BadRequestException()
        }

        if(content.trailer){
            await this.deleteTrailer(bucker, content.id)
        }

        const key = await this.uploadTrailer(file, bucker, content.id)
        return key
    }

}
