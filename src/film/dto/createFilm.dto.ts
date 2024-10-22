import { ContentType } from "@prisma/client"

export class createFilmDto {
    title: string
    type: ContentType
    duration: number
    releaseDate: Date;
    url: string
}