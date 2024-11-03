import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ContentService } from './content.service';
import { createContentDto, updateContentDto, } from './dto';
import { SeasonService } from 'src/season/season.service';
import { createSeasonDto, updateSeasonDto } from 'src/season/dto';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { v4 } from 'uuid';
import { url } from 'inspector';
import { BannerService } from 'src/banner/banner.service';
import { PosterService } from 'src/poster/poster.service';

@Controller('content')
export class ContentController {
    constructor(
        private readonly contentService:ContentService,
        private readonly seasonService:SeasonService,
        private readonly bannerService:BannerService,
        private readonly posterService:PosterService
    ){}
    
    @Get(":url")
    async getContentByUrl(@Param("url") url:string){
        const content = await this.contentService.getContentByUrl(url)
        if(!content){
            throw new BadRequestException()
        }
        return content
    }

    @UseInterceptors(FileFieldsInterceptor([
        {name: "banner", maxCount: 1},
        {name: "poster", maxCount: 1}
    ]))
    @Post()
    async createContent(@Body() dto:createContentDto, @UploadedFiles() files: {banner? : Express.Multer.File[], poster? : Express.Multer.File[] }){
        const banner = files.banner && files.banner[0]
        const poster = files.poster && files.poster[0]
        const bucker = "account-910"
        let bannerKey: string
        let posterKey: string
        if(banner){
            bannerKey = await this.bannerService.uploadBanner(banner, bucker)
        }
        if(poster){
            posterKey =  await this.posterService.uploadPoster(poster, bucker)
        } 
        return await this.contentService.createContent(dto, bannerKey, posterKey)
    }

    @Patch(":url")
    async updateContent(@Body() dto:updateContentDto, @Param("url") url:string){
        return await this.contentService.updateContent(dto, url)
    }

    @Delete(":url")
    async deleteContent(@Param("url") url:string){
        return await this.contentService.deleteContent(url)
    }

    @Get(":contentId/season")
    async getSeason(@Param("contentId", ParseIntPipe) contentId:number){
        return await this.seasonService.getSeasonByContentUrl(contentId)
    }

    @Post(":contentId/season")
    async createSeason(@Body() dto:createSeasonDto, @Param("contentId", ParseIntPipe) contentId:number){
        return await this.seasonService.createSeason(dto, contentId)
    }

    @Patch(":contentId/season/:seasonId")
    async updateSeason(@Body() dto: updateSeasonDto, @Param("contentId", ParseIntPipe) contentId:number, @Param("seasonId", ParseIntPipe) seasonId:number){
        return await this.seasonService.updateSeason(dto, contentId, seasonId)
    }

    @Delete(":contentId/season/:seasonId")
    async deleteSeason(@Param("contentUrl", ParseIntPipe) contentId:number, @Param("seasonId", ParseIntPipe) seasonId:number){
        return await this.seasonService.deleteSeason( contentId, seasonId)
    }

    @Patch(":contentUrl/media")
    @UseInterceptors(FileInterceptor("file"))
    async uploadMedia(@UploadedFile() file:Express.Multer.File, @Param("contentUrl") contentUrl:string){
        const bucker = "account-910"
        const key = v4()
        return await this.contentService.uploadFilm(file, contentUrl, bucker, key )
    }

    @Delete(":contentUrl/media")
    async deleteFilm(@Param("contentUrl") contentUrl:string){
        const bucker = "account-910"
        return await this.contentService.deleteFilm(contentUrl, bucker)
    }

}
