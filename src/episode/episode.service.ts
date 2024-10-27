import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SeasonService } from 'src/season/season.service';
import { createEpisode } from './dto';

@Injectable()
export class EpisodeService {
    constructor(
        private readonly prismaService:PrismaService,
        private readonly seasonService:SeasonService
    ){}

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
}

