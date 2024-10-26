import { ContentType } from "@prisma/client"

export class createContentDto {
    title: string
    type: ContentType
    duration: number
    releaseDate: number;
    url: string
}