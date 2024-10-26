import { BadRequestException, Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ContentService } from './content.service';
import { createContentDto, updateContentDto } from './dto';

@Controller('content')
export class ContentController {
    constructor(
        private readonly contentService:ContentService
    ){}
    
    @Get(":url")
    async getFilmByUrl(@Param("url") url:string){
        const content = await this.contentService.getContentByUrl(url)
        if(!content){
            throw new BadRequestException()
        }
        return content
    }

    @Patch(":url")
    updateFilm(@Body() dto:updateContentDto, @Param("url") url:string){
        return this.contentService.updateContent(dto, url)
    }

    @Post()
    async createFilm(@Body() dto:createContentDto){
        return await this.contentService.createContent(dto)
    }
}
