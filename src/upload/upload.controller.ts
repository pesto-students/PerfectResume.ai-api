import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
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

  @Post('s3')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.uploadService.uploadToS3(file);
  }
}
