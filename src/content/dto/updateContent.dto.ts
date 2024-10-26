import { ContentType } from "@prisma/client";

export class updateContentDto {
    title: string
    type: ContentType
    duration: number
    releaseDate: number;
    url: string
}