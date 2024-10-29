import { Controller, Param, Patch, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PosterService } from './poster.service';

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
}
