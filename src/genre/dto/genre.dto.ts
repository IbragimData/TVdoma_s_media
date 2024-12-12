import { IsString, MinLength } from "class-validator"

export class genreDto {
    @MinLength(2)
    @IsString()
    title: string
    @MinLength(2)
    @IsString()
    rusTitle: string
}