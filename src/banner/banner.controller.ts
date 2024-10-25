import { Controller, Param, Patch, RequestTimeoutException, UploadedFile, UseInterceptors } from '@nestjs/common';
import { BannerService } from './banner.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('banner')
export class BannerController {
    constructor(
        private readonly bannerService:BannerService
    ){}
    @Patch(":url")
    @UseInterceptors(FileInterceptor("file"))
    async upload(@UploadedFile() file:Express.Multer.File, @Param("url") url:string){
        const bucker = "account-910"
        const key = `${Date.now()}-${file.originalname}`
        return await this.bannerService.uploadBanner(url, file, bucker, key)
    }
}
