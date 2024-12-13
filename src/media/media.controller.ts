import { Controller, Get, Param, Post, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import {Response } from 'express';
import { MediaService } from './media.service';

@Controller('media')
export class MediaController {
    constructor(
        private readonly mediaService:MediaService,
        
    ){}
    @Get(':key')
    async streamVideo(@Param('key') key: string, @Res() res: Response) {
      const bucketName = "account-910"
      console.log(key)
      console.log(bucketName)
      return await this.mediaService.getMediaFile(bucketName, key, res)
    }
}


