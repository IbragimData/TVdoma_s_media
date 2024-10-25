import { Controller, Get, Param, Post, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { MediaService } from './media.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Stream } from 'stream';
import { Request, Response } from 'express';

@Controller('media')
export class MediaController {
    constructor(
        private readonly mediaService:MediaService
    ){}
    @Post("")
    @UseInterceptors(FileInterceptor("file"))
    async upload(@UploadedFile() file:Express.Multer.File){
        const bucker = "account-910"
        const key = `${Date.now()}-${file.originalname}`
        const data = await this.mediaService.upload(file, bucker, key)
        return data
    }
    @Get(':key')
    async getFile(@Param('key') key: string, @Res() res: Response) {
      const bucketName = 'account-910';  // Замените на ваше название бакета
      const file = await this.mediaService.getFile(bucketName, key);
  
      // Устанавливаем заголовки для файла
      res.set({
        'Content-Type': file.ContentType,
        'Content-Length': file.ContentLength,
      });
      // Передаем поток данных в response
      (file.Body as Stream).pipe(res);
    }
    @Get('video/:key')
    async streamVideo(@Param('key') key: string, @Req() req: Request, @Res() res: Response) {
      const bucketName = 'account-910';
      const range = req.headers.range;
    
      const videoFile = await this.mediaService.getFile(bucketName, key);
    
      if (!videoFile.Body) {
        return res.status(404).send('File not found');
      }
    
      const videoSize = videoFile.ContentLength;
      console.log(range)
      // Если диапазон отсутствует, возвращаем полный файл
        res.writeHead(200, {
          'Content-Type': videoFile.ContentType,
          'Content-Length': videoSize,
          'Accept-Ranges': 'bytes',
        });
        const stream = videoFile.Body as Stream;
        stream.pipe(res);
    }
}


