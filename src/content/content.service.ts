import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createContentDto, createSeasonDto, updateContentDto, updateSeasonDto } from './dto';


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

    async getSeasonByContentUrl(contentUrl:string){
        const content = await this.getContentByUrl(contentUrl)
        if(!content){
            throw new BadRequestException()
        }

        return await this.prismaService.season.findMany({
            where: {
                seriesId: content.url
            }
        })
    }

    async createSeason(dto: createSeasonDto, contentUrl:string){
        const content = await this.getContentByUrl(contentUrl)
        if(!content){
            throw new BadRequestException()
        }

        return await this.prismaService.season.create({
            data: {
                ...dto,
                seriesId: content.url
            }
        })
        
    }

    async updateSeason(dto: updateSeasonDto, contentUrl:string, seasonId:number){
        const content = await this.getContentByUrl(contentUrl)
        if(!content){
            throw new BadRequestException()
        }

        const season = await this.prismaService.season.findFirst({
            where: {
                id: seasonId,
                seriesId: content.url
            }
        })

        if(!season){
            throw new BadRequestException()
        }

        return await this.prismaService.season.update({
            where: {
                id: seasonId,
                seriesId: content.url
            },
            data: {
                ...dto
            }
        })
        
    }

    async deleteSeason(contentUrl:string, seasonId:number){
        const content = await this.getContentByUrl(contentUrl)
        if(!content){
            throw new BadRequestException()
        }

        const season = await this.prismaService.season.findFirst({
            where: {
                id: seasonId,
                seriesId: content.url
            }
        })

        if(!season){
            throw new BadRequestException()
        }

        return await this.prismaService.season.delete({
            where: {
                id: season.id,
                seriesId: content.url
            },
            select: {
                id:true
            }
        })
        
        
    }

}
