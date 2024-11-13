import { ContentType } from "@prisma/client"
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString, MinLength } from "class-validator";

export class updateContentDto {
    @IsString()
    @MinLength(1)
    title: string
    @Type(()=>Number)
    @IsNumber()
    duration: number
    @Type(()=>Number)
    @IsNumber()
    releaseDate: number;
    @IsString()
    @MinLength(2)
    @IsOptional()
    url?: string
    @Type(()=>Number)
    @IsNumber()
    ageLimit: number
    @IsString()
    @MinLength(1)
    originalTitle: string
    type: ContentType
}