import { Module } from '@nestjs/common';
import { TemplatesController } from './templates.controller';
import { TemplatesService } from './templates.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Template, TemplateSchema } from './schemas/template.schema';
import { UploadModule } from 'src/upload/upload.module';
import { PuppeteerHelper } from './helpers/puppeteer.helper';
import { GenerateHtml } from './helpers/generate-html';
import { ResumesModule } from 'src/resumes/resumes.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Template.name, schema: TemplateSchema },
    ]),
    UploadModule,
    ResumesModule,
  ],
  controllers: [TemplatesController],
  providers: [TemplatesService, PuppeteerHelper, GenerateHtml],
  exports: [TemplatesService],
})
export class TemplatesModule {}
