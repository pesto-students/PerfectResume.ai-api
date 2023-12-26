import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { DeleteFilesResponse, FileUrlsResponse } from 'src/uploadthing/types';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
    return this.uploadService.uploadFiles(files);
  }

  @Post('delete')
  async deleteFiles(@Body() fileKeys: string[]): Promise<DeleteFilesResponse> {
    return this.uploadService.deleteFiles(fileKeys);
  }

  @Post('urls')
  async getFileUrls(@Body() fileKeys: string[]): Promise<FileUrlsResponse> {
    return this.uploadService.getFileUrls(fileKeys);
  }
}
