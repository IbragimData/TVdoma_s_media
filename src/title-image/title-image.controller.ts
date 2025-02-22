import { Controller, Get, Param, Res } from '@nestjs/common';
import { TitleImageService } from './title-image.service';
import { Response } from 'express';

@Controller('title-image')
export class TitleImageController {
    constructor(
        private readonly titleImageService:TitleImageService
    ){}

    @Get(":key")
    async getPosterFile(@Param("key") key:string, @Res() res:Response){
        const bucketName = "01f301da-tvdoma1"
        console.log(bucketName)
        return await this.titleImageService.getTitleImageFile(bucketName, key, res)
    }
}
