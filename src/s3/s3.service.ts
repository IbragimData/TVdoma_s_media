import {
  DeleteObjectCommand,
  GetObjectCommand,
  GetObjectCommandOutput,
  S3Client,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'stream';


@Injectable()
export class S3Service {
  private s3: S3Client;
  constructor(private readonly configService: ConfigService) {
    this.s3 = new S3Client({
      region: this.configService.get('AWS_REGION'),
      endpoint: 'https://s3.timeweb.cloud',
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      },
      requestHandler: {
        connectionTimeout: 300000,
        socketTimeout: 300000,
      },
    });
  }

  async upload(file: Express.Multer.File, bucket: string, key: string) {
    const stream = Readable.from(file.buffer);

    // Конфигурация загрузки в S3
    const upload = new Upload({
      client: this.s3,
      params: {
        Key: key,
        Bucket: bucket,
        Body: stream, // Используем поток вместо буфера
        ContentType: file.mimetype,
      },
    });

    // Запускаем загрузку и возвращаем результат
    const data = await upload.done();
    console.log(data);
    return {
      key: data.Key,
    };
  }

  async getFile(bucker: string, key: string): Promise<GetObjectCommandOutput> {
    const command = new GetObjectCommand({
      Bucket: bucker,
      Key: key,
    });
    try {
      const res = await this.s3.send(command);

      return res;
    } catch (e) {
      throw new Error('could not retrieve file');
    }
  }

  async deleteFile(bucker: string, key: string) {
    const command = new DeleteObjectCommand({
      Bucket: bucker,
      Key: key,
    });
    try {
      const res = await this.s3.send(command);
      return res;
    } catch (e) {
      console.log(e);
      throw new Error('could not retrieve file');
    }
  }

  async getFileMedia(
    bucket: string,
    key: string,
    range?: string,
  ): Promise<GetObjectCommandOutput> {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
      Range: range, // Добавляем поддержку диапазонов
    });

    try {
      const res = await this.s3.send(command);
      return res;
    } catch (e) {
      console.error(e);
      throw new Error('Could not retrieve file');
    }
  }
}

