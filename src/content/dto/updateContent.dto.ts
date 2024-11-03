import { ContentType } from "@prisma/client";
import { Type } from "class-transformer";
import { IsDate, IsNumber, IsString, MinLength } from "class-validator";

export class updateContentDto {
    @IsString()
    @MinLength(2)
    title: string
    type: ContentType
    @Type(()=>Number)
    @IsNumber()
    duration: number
    @Type(()=>Date)
    @IsDate()
    releaseDate: Date;
    @IsString()
    @MinLength(2)
    url: string
}