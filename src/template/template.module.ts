import { Module } from '@nestjs/common';
import { TemplateService } from './template.service';
import { TemplateController } from './template.controller';
import { PuppeteerHelper } from './helpers/puppeteer.helper';
import { GenerateHtml } from './helpers/generate-html';
import { ResumesModule } from 'src/resumes/resumes.module';
import { TemplatesModule } from 'src/templates/templates.module';

@Module({
  imports: [ResumesModule, TemplatesModule],
  controllers: [TemplateController],
  providers: [TemplateService, PuppeteerHelper, GenerateHtml],
})
export class TemplateModule {}
