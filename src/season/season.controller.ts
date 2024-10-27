import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { createEpisode, updateEpisodeDto } from 'src/episode/dto';
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

    @Patch(":seasonId/episodes/:episodeId")
    async updateEpisode(@Body() dto:updateEpisodeDto, @Param("seasonId", ParseIntPipe) seasonId: number, @Param("episodeId", ParseIntPipe) episodeId: number){
        return await this.episodeService.updateEpisode(dto, seasonId, episodeId)
    }

    @Delete(":seasonId/episodes/:episodeId")
    async deleteEpisode(@Param("seasonId", ParseIntPipe) seasonId: number, @Param("episodeId", ParseIntPipe) episodeId: number){
        return await this.episodeService.deleteEpisode(seasonId, episodeId)
    }
}
