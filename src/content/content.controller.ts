import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ContentService } from './content.service';
import { createContentDto, updateContentDto } from './dto';
import { SeasonService } from 'src/season/season.service';
import { createSeasonDto, updateSeasonDto } from 'src/season/dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { BannerService } from 'src/banner/banner.service';
import { PosterService } from 'src/poster/poster.service';
import { title } from 'process';
import { TitleImageService } from 'src/title-image/title-image.service';
import { TrailerService } from 'src/trailer/trailer.service';
import { GenreService } from 'src/genre/genre.service';
import { filterContentDto } from './dto/filterContent.dto';

@Controller('content')
export class ContentController {
  constructor(
    private readonly contentService: ContentService,
    private readonly seasonService: SeasonService,
    private readonly bannerService: BannerService,
    private readonly posterService: PosterService,
    private readonly titleImageService: TitleImageService,
    private readonly trailerService: TrailerService,
    private readonly genreService: GenreService,
  ) {}


  @Get()
  getContent(
    @Query() dto: filterContentDto
  ){  
    return this.contentService.getMany(dto)
  }

  @Get(':url')
  async getContentByUrl(@Param('url') url: string) {
    const content = await this.contentService.getContentByUrl(url);
    if (!content) {
      throw new BadRequestException();
    }
    return content;
  }

  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'banner', maxCount: 1 },
      { name: 'poster', maxCount: 1 },
      { name: 'media', maxCount: 1 },
      { name: 'titleImage', maxCount: 1 },
      { name: 'trailer', maxCount: 1 },
    ]),
  )
  @Post()
  async createContent(
    @Body() dto: createContentDto,
    @UploadedFiles()
    files: {
      banner?: Express.Multer.File[];
      poster?: Express.Multer.File[];
      media?: Express.Multer.File[];
      titleImage?: Express.Multer.File[];
      trailer: Express.Multer.File[];
    },
  ) {
    const content = await this.contentService.getContentByUrl(dto.url);
    if (content) {
      throw new BadRequestException();
    }
    const poster = files.poster && files.poster[0];
    const media = files.media && files.media[0];
    const titleImage = files.titleImage && files.titleImage[0];
    const trailer = files.trailer && files.trailer[0];
    const bucker = 'account-910';
    let bannerKey: string;
    let posterKey: string;
    let mediaKey: string;
    let titleImageKey: string;
    let trailerKey: string;
    if (poster) {
      posterKey = await this.posterService.uploadPoster(poster, bucker);
    }
    if (media) {
      mediaKey = await this.contentService.uploadMedia(media, bucker);
    }
    if (titleImage) {
      titleImageKey = await this.titleImageService.uploadTitleImage(
        media,
        bucker,
      );
    }
    if (trailer) {
      trailerKey = await this.trailerService.uploadTrailer(trailer, bucker);
    }

    return await this.contentService.createContent(
      dto,
      bannerKey,
      posterKey,
      mediaKey,
      titleImageKey,
      trailerKey,
    );
  }

  @Patch(':url')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'banner', maxCount: 1 },
      { name: 'poster', maxCount: 1 },
      { name: 'media', maxCount: 1 },
      { name: 'titleImage', maxCount: 1 },
      { name: 'trailer', maxCount: 1 },
    ]),
  )
  async updateContent(
    @Body() dto: updateContentDto,
    @Param('url') url: string,
    @UploadedFiles()
    files: {
      banner?: Express.Multer.File[];
      poster?: Express.Multer.File[];
      media?: Express.Multer.File[];
      titleImage?: Express.Multer.File[];
      trailer: Express.Multer.File[];
    },
  ) {
    const bucker = 'account-910';
    let bannerKey: string;
    const trailer = files.trailer && files.trailer[0];
    let trailerKey: string;
    const titleImage = files.titleImage && files.titleImage[0];
    let titleImageKey: string;
    const poster = files.poster && files.poster[0];
    let posterKey: string;
    const media = files.media && files.media[0];
    let mediaKey: string;
    const content = await this.contentService.getContentByUrl(url);
    if (!content) {
      throw new BadRequestException();
    }
    if (trailer) {
      trailerKey = await this.trailerService.updateTrailer(
        content.id,
        bucker,
        trailer,
      );
    }
    if (titleImage) {
      titleImageKey = await this.titleImageService.updateTitleImage(
        content.id,
        bucker,
        titleImage,
      );
    }
    if (poster) {
      posterKey = await this.posterService.updatePoster(
        content.id,
        bucker,
        poster,
      );
    }
    if (media) {
      mediaKey = await this.contentService.updateMedia(
        content.id,
        bucker,
        titleImage,
      );
    }
    return await this.contentService.updateContent(
      dto,
      url,
      bannerKey,
      trailerKey,
      titleImageKey,
      posterKey,
      mediaKey,
    );
  }

  @Delete(':url')
  async deleteContent(@Param('url') url: string) {
    const content = await this.contentService.getContentByUrl(url);
    const bucker = 'account-910';
    if (!content) {
      throw new BadRequestException();
    }

    if (content.banner) {
      await this.bannerService.deleteBanner(bucker, content.id);
    }
    if (content.poster) {
      await this.posterService.deletePoster(bucker, content.id);
    }
    if (content.titleImage) {
      await this.titleImageService.deleteTitleImage(bucker, content.id);
    }
    if (content.trailer) {
      await this.trailerService.deleteTrailer(bucker, content.id);
    }
    if (content.media) {
      await this.contentService.deleteMedia(content.id, bucker);
    }
    return await this.contentService.deleteContent(url);
  }

  @Get(':contentId/season')
  async getSeason(@Param('contentId', ParseIntPipe) contentId: number) {
    return await this.seasonService.getSeasonByContentUrl(contentId);
  }

  @Post(':contentId/season')
  async createSeason(
    @Body() dto: createSeasonDto,
    @Param('contentId', ParseIntPipe) contentId: number,
  ) {
    return await this.seasonService.createSeason(dto, contentId);
  }

  @Patch(':contentId/season/:seasonId')
  async updateSeason(
    @Body() dto: updateSeasonDto,
    @Param('contentId', ParseIntPipe) contentId: number,
    @Param('seasonId', ParseIntPipe) seasonId: number,
  ) {
    return await this.seasonService.updateSeason(dto, contentId, seasonId);
  }

  @Delete(':contentId/season/:seasonId')
  async deleteSeason(
    @Param('contentUrl', ParseIntPipe) contentId: number,
    @Param('seasonId', ParseIntPipe) seasonId: number,
  ) {
    return await this.seasonService.deleteSeason(contentId, seasonId);
  }

  @Delete(':contentId/media')
  async deleteMedia(@Param('contentId', ParseIntPipe) contentId: number) {
    console.log(contentId);
    const bucker = 'account-910';
    return await this.contentService.deleteMedia(contentId, bucker);
  }

  @Delete(':contentId/poster')
  async deletePoster(@Param('contentId', ParseIntPipe) contentId: number) {
    const bucker = 'account-910';
    return await this.posterService.deletePoster(bucker, contentId);
  }
  

  @UseInterceptors(FileFieldsInterceptor([
    {name: "banner", maxCount: 1}
  ]))
  @Post(':contentId/banner')
  async uploadBanner(@Param('contentId', ParseIntPipe) contentId: number, @UploadedFiles() files: {banner?: Express.Multer.File[]; }) {
    const bucker = 'account-910';
    const content = await this.contentService.getContentById(contentId)
    if(!content){
      throw new BadRequestException()
    }
    const banner = files.banner[0]
    if(!banner){
      throw new BadRequestException()
    }
    return await this.bannerService.uploadBanner(banner, bucker, contentId);
  }

  @Delete(':contentId/banner')
  async deleteBanner(@Param('contentId', ParseIntPipe) contentId: number) {
    const bucker = 'account-910';
    return await this.bannerService.deleteBanner(bucker, contentId);
  }

  @Delete(':contentId/title-image')
  async deleteTitleImage(@Param('contentId', ParseIntPipe) contentId: number) {
    const bucker = 'account-910';
    return await this.titleImageService.deleteTitleImage(bucker, contentId);
  }

  @Delete(':contentId/trailer')
  async deleteTrailer(@Param('contentId', ParseIntPipe) contentId: number) {
    const bucker = 'account-910';
    return await this.trailerService.deleteTrailer(bucker, contentId);
  }

  @Post('genre/:contentId/add-multiple')
  async addMultipleGenresToContent(
    @Param('contentId', ParseIntPipe) contentId: number,
    @Body('genreIds') genreIds: number[],
  ) {
    return this.genreService.addMultipleGenresToContent(contentId, genreIds);
  }

  @Delete('genre/:contentId/:genreId')
  async deleteGenreFromContent(
    @Param('contentId', ParseIntPipe) contentId: number,
    @Param('genreId', ParseIntPipe) genreId: number,
  ) {
    return this.genreService.deleteGenreFromContent(contentId, genreId);
  }
}
