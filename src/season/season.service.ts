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

    async getSeasonByContentUrl(contentId:number){
        const content = await this.contentService.getContentById(contentId)
        if(!content){
            throw new BadRequestException()
        }

        return await this.prismaService.season.findMany({
            where: {
                contentId: content.id
            }
        })
    }

    async createSeason(dto: createSeasonDto, contentId:number){
        const content = await this.contentService.getContentById(contentId)
        if(!content){
            throw new BadRequestException()
        }

        return await this.prismaService.season.create({
            data: {
                ...dto,
                contentId: content.id
            }
        })
        
    }

    async updateSeason(dto: updateSeasonDto, contentId:number, seasonId:number){
        const content = await this.contentService.getContentById(contentId)
        if(!content){
            throw new BadRequestException()
        }

        const season = await this.prismaService.season.findFirst({
            where: {
                id: seasonId,
                contentId: content.id
            }
        })

        if(!season){
            throw new BadRequestException()
        }

        return await this.prismaService.season.update({
            where: {
                id: seasonId,
                contentId: content.id
            },
            data: {
                ...dto
            }
        })
        
    }

    async deleteSeason(contentId:number, seasonId:number){
        const content = await this.contentService.getContentById(contentId)
        if(!content){
            throw new BadRequestException()
        }

        const season = await this.prismaService.season.findFirst({
            where: {
                id: seasonId,
                contentId: content.id
            }
        })

        if(!season){
            throw new BadRequestException()
        }

        return await this.prismaService.season.delete({
            where: {
                id: season.id,
                contentId: content.id
            },
            select: {
                id:true
            }
        })
        
        
    }
}
