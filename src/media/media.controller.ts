import {
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { MediaService } from './media.service';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}
  @Get(':key')
  async streamVideo(@Param('key') key: string, @Res() res: Response) {
    const bucketName = 'account-910';
    console.log(`Streaming video: ${key} from bucket: ${bucketName}`);

    try {
      await this.mediaService.getMediaFile(bucketName, key, res);
    } catch (error) {
      console.error('Error in media controller:', error.message);
      res.status(500).send('Error retrieving the video file');
    }
  }
}
