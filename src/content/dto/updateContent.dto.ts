import { ContentType } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class updateContentDto {
  @IsString()
  @MinLength(1)
  title: string;
  @IsString()
  @MinLength(1)
  originalTitle: string;
  @IsString()
  @MinLength(1)
  description: string;
  @IsString()
  @MinLength(1)
  shortDescription: string;
  @Type(() => Number)
  @IsNumber()
  ageLimit: number;
  @IsString()
  @MinLength(1)
  country: string;
  @Type(() => Number)
  @IsNumber()
  duration: number;
  @Type(() => Number)
  @IsNumber()
  trailerDuration: number;
  @Type(() => Date)
  @IsDate()
  releaseDate: Date;
  @IsString()
  @MinLength(2)
  url: string;
  type: ContentType;
  mainGenre: string
}
