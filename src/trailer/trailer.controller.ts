import { Controller, Get, Param, Res } from '@nestjs/common';
import { TrailerService } from './trailer.service';
import { Response } from 'express';

@Controller('trailer')
export class TrailerController {
    constructor(
        private readonly trailerService:TrailerService
    ){}
    @Get(":key")
    async getPosterFile(@Param("key") key:string, @Res() res:Response){
        const bucketName = "01f301da-tvdoma1"
        console.log(bucketName)
        return await this.trailerService.getTrailerFile(bucketName, key, res)
    }
}
