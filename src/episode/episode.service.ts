import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SeasonService } from 'src/season/season.service';
import { createEpisode, updateEpisodeDto } from './dto';
import { S3Service } from 'src/s3/s3.service';

@Injectable()
export class EpisodeService {
    constructor(
        private readonly prismaService:PrismaService,
        private readonly seasonService:SeasonService,
        private readonly s3Service:S3Service
    ){}

    async getEpisodeById(id:number){
        return await this.prismaService.episode.findFirst({
            where: {
                id
            }
        })
    }

    async getEpisodesBySeasonId(seasonId:number){
        const season = await this.seasonService.getSeasonById(seasonId)
        if(!season){
            throw new BadRequestException()
        }

        return await this.prismaService.episode.findMany({
            where: {
                seasonId
            }
        })
    }

    async createEpisode(dto: createEpisode, seasonId:number){
        const season = await this.seasonService.getSeasonById(seasonId)
        if(!season){
            throw new BadRequestException()
        }

        return await this.prismaService.episode.create({
            data: {
                ...dto,
                seasonId
            }
        })
    }

    async updateEpisode(dto:updateEpisodeDto, seasonId: number, episodeId:number){
        const episode = await this.prismaService.episode.findFirst({
            where: {
                id: episodeId,
                seasonId
            }
        })
        if(!episode){
            throw new BadRequestException()
        }
        
        return await this.prismaService.episode.update({
            where: {
                id: episode.id
            },
            data: {
                ...dto
            }
        })
    }

    async deleteEpisode(seasonId: number, episodeId:number){
        const episode = await this.prismaService.episode.findFirst({
            where: {
                id: episodeId,
                seasonId
            }
        })
        if(!episode){
            throw new BadRequestException()
        }

        return await this.prismaService.episode.delete({
            where: {
                id: episodeId
            },
            select: {
                id: true
            }
        })
    }

    async uploadMedia(id:number, file:Express.Multer.File, key:string, bucker:string){
        const episode = await this.getEpisodeById(id)
        if(!episode){
            throw new BadRequestException()
        }

        const _key = await this.s3Service.upload(file, bucker, "media/" + key)
        const resUpload = _key.key.substring(6)
        return await this.prismaService.episode.update({
            where: {
                id
            },
            data: {
                media: resUpload
            }
        })
    }
}