import { Controller, Delete, Get, Param, Patch, RequestTimeoutException, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { BannerService } from './banner.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@Controller('banner')
export class BannerController {
    constructor(
        private readonly bannerService:BannerService
    ){}
    @Patch(":url")
    @UseInterceptors(FileInterceptor("file"))
    async upload(@UploadedFile() file:Express.Multer.File, @Param("url") url:string){
        const bucker = "account-910"
        const key = new Date().toISOString()
        return await this.bannerService.uploadBanner(url, file, bucker, key)
    }

    @Delete(":url")
    deleteBanner(@Param("url") url:string){
        const bucker = "account-910"
        return this.bannerService.deleteBanner(bucker, url)
    }

    @Get(":key")
    async getBannerFile(@Param("key") key:string, @Res() res:Response){
        const bucketName = 'account-910';
        return await this.bannerService.getBannerFile(bucketName, key, res)
    }

}
