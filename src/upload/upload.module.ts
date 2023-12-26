import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { utapiProvider } from 'src/uploadthing/uploadthing';

@Module({
  controllers: [UploadController],
  providers: [UploadService, utapiProvider],
  exports: [UploadService],
})
export class UploadModule {}
