import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createContentDto, updateContentDto } from './dto';


@Injectable()
export class ContentService {
    constructor(
        private readonly prismaService:PrismaService
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
}
