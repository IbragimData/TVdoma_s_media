import { Type } from "class-transformer"
import { IsDate } from "class-validator"

export class createEpisode {
    title:string
    number:number
    duration: number
    @Type(()=>Date)
    @IsDate()
    releaseDate: Date
}