import {
  UploadFileResponse,
  FileEsque,
  FileUrlsResponse,
  DeleteFilesResponse,
} from 'src/uploadthing/types';
import { Injectable, Inject } from '@nestjs/common';
import { UTApi } from 'uploadthing/server';
import { UTAPI_PROVIDER } from '../uploadthing/uploadthing';
import { S3Service } from 'src/uploadthing/s3Service';

@Injectable()
export class UploadService {
  constructor(
    @Inject(UTAPI_PROVIDER) private utapi: UTApi,
    private readonly s3Service: S3Service,
  ) {}

  async uploadFiles(
    files: Express.Multer.File[],
  ): Promise<UploadFileResponse[] | UploadFileResponse> {
    // Transform the incoming files to the format expected by UTApi
    const transformedFiles = files.map((file) =>
      this.transformToFileEsque(file),
    );

    // Now pass the transformed files to utapi.uploadFiles
    const response = await this.utapi.uploadFiles(transformedFiles);
    return response;
  }

  async uploadToS3(file: Express.Multer.File): Promise<{ url: string }> {
    const response = await this.s3Service.uploadToS3(file);
    return response;
  }

  async deleteFiles(fileKeys: string | string[]): Promise<DeleteFilesResponse> {
    const response = await this.utapi.deleteFiles(fileKeys);
    return response;
  }

  async getFileUrls(fileKeys: string | string[]): Promise<FileUrlsResponse> {
    const response = await this.utapi.getFileUrls(fileKeys);
    return response;
  }

  private transformToFileEsque(file: Express.Multer.File): FileEsque {
    // Assuming the file buffer and originalname are available,
    // and that the Blob part of FileEsque is compatible with Buffer from multer
    const fileEsque: FileEsque = new Blob([file.buffer], {
      type: file.mimetype,
    }) as Blob & { name: string };
    fileEsque.name = file.originalname || 'sample';
    return fileEsque;
  }
}
