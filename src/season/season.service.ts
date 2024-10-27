import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {createSeasonDto, updateSeasonDto } from './dto';
import { ContentService } from 'src/content/content.service';

@Injectable()
export class SeasonService {

    constructor(
        private readonly prismaService:PrismaService,
        private readonly contentService:ContentService
    ){}

    async getSeasonById(id:number){
        return await this.prismaService.season.findFirst({
            where: {
                id
            }
        })
    }

    async getSeasonByContentUrl(contentUrl:string){
        const content = await this.contentService.getContentByUrl(contentUrl)
        if(!content){
            throw new BadRequestException()
        }

        return await this.prismaService.season.findMany({
            where: {
                seriesUrl: content.url
            }
        })
    }

    async createSeason(dto: createSeasonDto, contentUrl:string){
        const content = await this.contentService.getContentByUrl(contentUrl)
        if(!content){
            throw new BadRequestException()
        }

        return await this.prismaService.season.create({
            data: {
                ...dto,
                seriesUrl: content.url
            }
        })
        
    }

    async updateSeason(dto: updateSeasonDto, contentUrl:string, seasonId:number){
        const content = await this.contentService.getContentByUrl(contentUrl)
        if(!content){
            throw new BadRequestException()
        }

        const season = await this.prismaService.season.findFirst({
            where: {
                id: seasonId,
                seriesUrl: content.url
            }
        })

        if(!season){
            throw new BadRequestException()
        }

        return await this.prismaService.season.update({
            where: {
                id: seasonId,
                seriesUrl: content.url
            },
            data: {
                ...dto
            }
        })
        
    }

    async deleteSeason(contentUrl:string, seasonId:number){
        const content = await this.contentService.getContentByUrl(contentUrl)
        if(!content){
            throw new BadRequestException()
        }

        const season = await this.prismaService.season.findFirst({
            where: {
                id: seasonId,
                seriesUrl: content.url
            }
        })

        if(!season){
            throw new BadRequestException()
        }

        return await this.prismaService.season.delete({
            where: {
                id: season.id,
                seriesUrl: content.url
            },
            select: {
                id:true
            }
        })
        
        
    }
}
