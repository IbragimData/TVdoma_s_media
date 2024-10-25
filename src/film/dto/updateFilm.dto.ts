import { ContentType } from "@prisma/client";

export class updateFilmDto {
    title: string
    type: ContentType
    duration: number
    releaseDate: number;
    url: string
}