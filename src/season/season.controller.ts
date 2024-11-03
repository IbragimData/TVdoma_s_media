import { Upload } from '@aws-sdk/lib-storage';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { AnyFilesInterceptor, FileFieldsInterceptor } from '@nestjs/platform-express';
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

    @Post()
    @UseInterceptors(FileFieldsInterceptor([
        {name: "file", maxCount: 1},
        {name: "file2", maxCount: 1}
    ]))
    getAll(@Body() dto: {name:string, age: number}, @UploadedFiles() files: {file?: Express.Multer.File[], file2?: Express.Multer.File[]}){
        const file = files.file && files.file[0]
        const file2 = files.file2 && files.file2[0]
        console.log(file)
        console.log(file2)
        console.log(dto)
        return dto
    }
}
