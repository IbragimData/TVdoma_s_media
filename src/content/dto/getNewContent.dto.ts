import { Type } from "class-transformer";
import { IsInt, IsOptional, Min } from "class-validator";

export class GetNewContent {
    @IsOptional()
    @IsInt()
    @Min(1)
    @Type(() => Number)
    page: number = 1
}