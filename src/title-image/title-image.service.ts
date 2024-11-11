import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { S3Service } from 'src/s3/s3.service';
import { v4 } from 'uuid';

@Injectable()
export class TitleImageService {
    constructor(
        private readonly prismaService:PrismaService,
        private readonly s3Service:S3Service
    ){}

    async uploadTitleImage(file:Express.Multer.File, bucker:string){
        const key = v4()

        const _key = await this.s3Service.upload(file, bucker, "title-image/" + key)
        const resUpload =  _key.key.substring(12)
        return resUpload
    }

}
