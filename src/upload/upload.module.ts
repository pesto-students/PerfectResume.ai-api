import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { utapiProvider } from 'src/uploadthing/uploadthing';
import { S3Service } from 'src/uploadthing/s3Service';

@Module({
  controllers: [UploadController],
  providers: [UploadService, utapiProvider, S3Service],
  exports: [UploadService],
})
export class UploadModule {}
