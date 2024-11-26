import { ContentType } from "@prisma/client"
import { Type } from "class-transformer"
import { IsInt, IsOptional, IsString, Min } from "class-validator"

export class filterContentDto{
    @IsOptional()
    @IsInt()
    @Type(()=>Number)
    releaseDate?:string
    @IsOptional()
    @IsInt()
    @Min(1)
    @Type(()=>Number)
    page:number = 1
    @IsOptional()
    @IsString()
    genre?:string
    @IsOptional()
    @IsString()
    type?: ContentType
}