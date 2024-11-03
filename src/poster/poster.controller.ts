import { Controller, Get, Param, Res } from '@nestjs/common';
import { PosterService } from './poster.service';
import { Response } from 'express';

@Controller('poster')
export class PosterController {
    constructor(
        private readonly posterService:PosterService
    ){}
    @Get(":key")
    async getPosterFile(@Param("key") key:string, @Res() res:Response){
        const bucketName = "account-910"
        return await this.posterService.getPosterFile(bucketName, key, res)
    }
}
