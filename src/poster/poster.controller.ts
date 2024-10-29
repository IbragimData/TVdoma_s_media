import { Controller, Delete, Get, Param, Patch, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PosterService } from './poster.service';
import { Response } from 'express';

@Controller('poster')
export class PosterController {
    constructor(
        private readonly posterService:PosterService
    ){}

    @Patch(":url")
    @UseInterceptors(FileInterceptor("file"))
    async uploadPoster(@UploadedFile() file:Express.Multer.File, @Param("url") url:string){
        const bucker = "account-910"
        return await this.posterService.uploadPoster(url, file, bucker)
    }

    @Delete(":url")
    async deletePoster(@Param("url") url:string){
        const bucker = "account-910"
        return this.posterService.deletePoster(bucker, url)
    }

    @Get(":key")
    async getPosterFile(@Param("key") key:string, @Res() res:Response){
        const bucketName = "account-910"
        return await this.posterService.getPosterFile(bucketName, key, res)
    }
}
