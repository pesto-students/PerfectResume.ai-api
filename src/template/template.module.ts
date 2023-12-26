import { Module } from '@nestjs/common';
import { TemplateService } from './template.service';
import { TemplateController } from './template.controller';
import { PuppeteerHelper } from './helpers/puppeteer.helper';

@Module({
  controllers: [TemplateController],
  providers: [TemplateService, PuppeteerHelper],
})
export class TemplateModule {}
