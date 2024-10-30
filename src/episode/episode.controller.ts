import { Controller, Param, ParseIntPipe, Patch, UploadedFile, UseInterceptors } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EpisodeService } from './episode.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { v4 } from 'uuid';

@Controller('episode')
export class EpisodeController {
    constructor(
        private readonly episodeService:EpisodeService
    ){}

    @Patch(":id/media")
    @UseInterceptors(FileInterceptor("file"))
    async uploadMedia(@Param("id", ParseIntPipe) id:number, @UploadedFile() file: Express.Multer.File){
        const key = v4()
        const bucker = "account-910"
        return await this.episodeService.uploadMedia(id, file, key, bucker)
    }
}
