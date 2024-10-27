import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ContentService } from './content.service';
import { createContentDto, updateContentDto, } from './dto';
import { SeasonService } from 'src/season/season.service';
import { createSeasonDto, updateSeasonDto } from 'src/season/dto';

@Controller('content')
export class ContentController {
    constructor(
        private readonly contentService:ContentService,
        private readonly seasonService:SeasonService
    ){}
    
    @Get(":url")
    async getContentByUrl(@Param("url") url:string){
        const content = await this.contentService.getContentByUrl(url)
        if(!content){
            throw new BadRequestException()
        }
        return content
    }

    @Post()
    async createContent(@Body() dto:createContentDto){
        return await this.contentService.createContent(dto)
    }

    @Patch(":url")
    async updateContent(@Body() dto:updateContentDto, @Param("url") url:string){
        return await this.contentService.updateContent(dto, url)
    }

    @Delete(":url")
    async deleteContent(@Param("url") url:string){
        return await this.contentService.deleteContent(url)
    }

    @Get(":contentUrl/season")
    async getSeason(@Param("contentUrl") contentUrl:string){
        return await this.seasonService.getSeasonByContentUrl(contentUrl)
    }

    @Post(":contentUrl/season")
    async createSeason(@Body() dto:createSeasonDto, @Param("contentUrl") contentUrl:string){
        return await this.seasonService.createSeason(dto, contentUrl)
    }

    @Patch(":contentUrl/season/:seasonId")
    async updateSeason(@Body() dto: updateSeasonDto, @Param("contentUrl") contentUrl:string, @Param("seasonId", ParseIntPipe) seasonId:number){
        return await this.seasonService.updateSeason(dto, contentUrl, seasonId)
    }

    @Delete(":contentUrl/season/:seasonId")
    async deleteSeason(@Param("contentUrl") contentUrl:string, @Param("seasonId", ParseIntPipe) seasonId:number){
        return await this.seasonService.deleteSeason( contentUrl, seasonId)
    }


}
