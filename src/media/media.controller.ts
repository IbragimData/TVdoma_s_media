import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { MediaService } from './media.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('media')
export class MediaController {
    constructor(
        private readonly mediaService:MediaService
    ){}
    @Post("")
    @UseInterceptors(FileInterceptor("file"))
    upload(@UploadedFile() file:Express.Multer.File){
        const bucker = "account-910"
        const key = `${Date.now()}-${file.originalname}`
        this.mediaService.upload(file, bucker, key)
        return "ok"
    }
}
