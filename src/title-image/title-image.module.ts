import { Module } from '@nestjs/common';
import { TitleImageService } from './title-image.service';
import { TitleImageController } from './title-image.controller';

@Module({
  providers: [TitleImageService],
  controllers: [TitleImageController]
})
export class TitleImageModule {}
