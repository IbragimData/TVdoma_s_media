import { ContentType } from "@prisma/client"

export class createFilmDto {
    title: string
    type: ContentType
    duration: number
    releaseDate: number;
    url: string
}