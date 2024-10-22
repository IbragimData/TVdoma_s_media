import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { MediaModule } from './media/media.module';
import { FilmModule } from './film/film.module';
import { BannerModule } from './banner/banner.module';

@Module({
  imports: [PrismaModule, ConfigModule.forRoot({
    isGlobal: true
  }), MediaModule, FilmModule, BannerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
