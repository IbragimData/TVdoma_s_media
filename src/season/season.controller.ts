import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { createEpisode } from 'src/episode/dto';
import { EpisodeService } from 'src/episode/episode.service';

@Controller('season')
export class SeasonController {
    constructor(
        private readonly episodeService:EpisodeService
    ){}

    @Get(":seasonId/episodes")
    async getEpisodesBySeasonId(@Param("seasonId", ParseIntPipe) seasonId:number){
        return await this.episodeService.getEpisodesBySeasonId(seasonId)
    }

    @Post(":seasonId/episodes")
    async createEpisode(@Body() dto:createEpisode, @Param("seasonId", ParseIntPipe) seasonId: number){
        return await this.episodeService.createEpisode(dto, seasonId)
    }
}
