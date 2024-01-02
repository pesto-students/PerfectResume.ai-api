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
import { S3Service } from 'src/uploadthing/s3Service';

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

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const bucketName = 'your-s3-bucket-name';

    try {
      const s3Service = new S3Service();
      const result = await s3Service.uploadToS3(
        bucketName,
        file.originalname,
        file.buffer,
      );
      console.log('File uploaded successfully:', result);
      return { url: result };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('Failed to upload image');
    }
  }
}
