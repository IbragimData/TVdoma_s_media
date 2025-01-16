import { Controller, Get, Param, Res } from '@nestjs/common';
import { BannerService } from './banner.service';
import { Response } from 'express';

@Controller('banner')
export class BannerController {
    constructor(
        private readonly bannerService:BannerService
    ){}

    @Get(":key")
    async getBannerFile(@Param("key") key:string, @Res() res:Response){
        const bucketName = '01f301da-9134476f-1b10-485d-89aa-d32769ac66de';
        return await this.bannerService.getBannerFile(bucketName, key, res)
    }

}
