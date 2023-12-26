import { Module } from '@nestjs/common';
import { ResumesController } from './resumes.controller';
import { ResumesService } from './resumes.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Resume, ResumeSchema } from './schemas/resume.schema';
import { UploadModule } from 'src/upload/upload.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Resume.name, schema: ResumeSchema }]),
    UploadModule,
  ],
  controllers: [ResumesController],
  providers: [ResumesService],
})
export class ResumesModule {}
