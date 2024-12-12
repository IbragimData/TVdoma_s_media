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
import { TitleImageService } from 'src/title-image/title-image.service';
import { TrailerService } from 'src/trailer/trailer.service';
import { GenreService } from 'src/genre/genre.service';
import { filterContentDto } from './dto/filterContent.dto';
import { MediaService } from 'src/media/media.service';

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
    private readonly mediaService:MediaService
  ) {}

  @Get()
  getContent(@Query() dto: filterContentDto) {
    return this.contentService.getMany(dto);
  }

  @Get(':url')
  async getContentByUrl(@Param('url') url: string) {
    const content = await this.contentService.getContentByUrl(url);
    if (!content) {
      throw new BadRequestException();
    }
    return content;
  }

  @Post()
  async createContent(@Body() dto: createContentDto) {
    console.log(dto)
    const content = await this.contentService.getContentByUrl(dto.url);
    if (content) {
      throw new BadRequestException();
    }
    return await this.contentService.createContent(dto);
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

  @UseInterceptors(FileFieldsInterceptor([{ name: 'media', maxCount: 1 }]))
  @Post(':contentId/media')
  async uploadMedia(
    @Param('contentId', ParseIntPipe) contentId: number,
    @UploadedFiles() files: { media: Express.Multer.File[] },
  ) {
    const bucker = 'account-910';
    const content = await this.contentService.getContentById(contentId);
    if (!content) {
      throw new BadRequestException();
    }
    const media = files.media[0];
    if (!media) {
      throw new BadRequestException();
    }

    return await this.mediaService.uploadMedia(
      media,
      bucker,
      contentId,
    );
  }

  @Delete(':contentId/media')
  async deleteMedia(@Param('contentId', ParseIntPipe) contentId: number) {
    const bucker = 'account-910';
    return await this.mediaService.deleteMedia(contentId, bucker);
  }

  @UseInterceptors(FileFieldsInterceptor([{ name: 'poster', maxCount: 1 }]))
  @Post(':contentId/poster')
  async uploadPoster(
    @Param('contentId', ParseIntPipe) contentId: number,
    @UploadedFiles() files: { poster: Express.Multer.File[] },
  ) {
    const bucker = 'account-910';
    const content = await this.contentService.getContentById(contentId);
    if (!content) {
      throw new BadRequestException();
    }
    const poster = files.poster[0];
    if (!poster) {
      throw new BadRequestException();
    }

    return await this.posterService.uploadPoster(poster, bucker, contentId);
  }

  @Delete(':contentId/poster')
  async deletePoster(@Param('contentId', ParseIntPipe) contentId: number) {
    const bucker = 'account-910';
    return await this.posterService.deletePoster(bucker, contentId);
  }

  @UseInterceptors(FileFieldsInterceptor([{ name: 'banner', maxCount: 1 }]))
  @Post(':contentId/banner')
  async uploadBanner(
    @Param('contentId', ParseIntPipe) contentId: number,
    @UploadedFiles() files: { banner?: Express.Multer.File[] },
  ) {
    const bucker = 'account-910';
    const content = await this.contentService.getContentById(contentId);
    if (!content) {
      throw new BadRequestException();
    }
    const banner = files.banner[0];
    if (!banner) {
      throw new BadRequestException();
    }
    return await this.bannerService.uploadBanner(banner, bucker, contentId);
  }

  @Delete(':contentId/banner')
  async deleteBanner(@Param('contentId', ParseIntPipe) contentId: number) {
    const bucker = 'account-910';
    return await this.bannerService.deleteBanner(bucker, contentId);
  }

  @UseInterceptors(FileFieldsInterceptor([{ name: 'titleImage', maxCount: 1 }]))
  @Post(':contentId/title-image')
  async uploadTitleImage(
    @Param('contentId', ParseIntPipe) contentId: number,
    @UploadedFiles() files: { titleImage: Express.Multer.File[] },
  ) {
    const bucker = 'account-910';
    const content = await this.contentService.getContentById(contentId);
    if (!content) {
      throw new BadRequestException();
    }
    const titleImage = files.titleImage[0];
    if (!titleImage) {
      throw new BadRequestException();
    }

    return await this.titleImageService.uploadTitleImage(
      titleImage,
      bucker,
      contentId,
    );
  }

  @Delete(':contentId/title-image')
  async deleteTitleImage(@Param('contentId', ParseIntPipe) contentId: number) {
    const bucker = 'account-910';
    return await this.titleImageService.deleteTitleImage(bucker, contentId);
  }

  @UseInterceptors(FileFieldsInterceptor([{ name: 'trailer', maxCount: 1 }]))
  @Post(':contentId/trailer')
  async uploadTrailer(
    @Param('contentId', ParseIntPipe) contentId: number,
    @UploadedFiles() files: { trailer: Express.Multer.File[] },
  ) {
    const bucker = 'account-910';
    const content = await this.contentService.getContentById(contentId);
    if (!content) {
      throw new BadRequestException();
    }
    const trailer = files.trailer[0];
    if (!trailer) {
      throw new BadRequestException();
    }

    return await this.trailerService.uploadTrailer(trailer, bucker, contentId);
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
