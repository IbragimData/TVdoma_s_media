import { Controller, Delete, Get, Param, Res } from '@nestjs/common';
import { PosterService } from './poster.service';
import { Response } from 'express';

@Controller('poster')
export class PosterController {
    constructor(
        private readonly posterService:PosterService
    ){}
    @Get(":key")
    async getPosterFile(@Param("key") key:string, @Res() res:Response){
        const bucketName = "01f301da-9134476f-1b10-485d-89aa-d32769ac66de"
        return await this.posterService.getPosterFile(bucketName, key, res)
    }
}
