import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PuppeteerHelper } from './helpers/puppeteer.helper';
import { ResumesService } from 'src/resumes/resumes.service';
import { TemplatesService } from 'src/templates/templates.service';
import { GeneratePdfDto } from './dto/generatePdf.dto';
// import * as fs from 'fs';
// import * as path from 'path';

@Injectable()
export class TemplateService {
  @Inject()
  private readonly puppeteerHelper: PuppeteerHelper;

  constructor(
    private readonly resumesService: ResumesService,
    private readonly templatesService: TemplatesService,
  ) {}

  getTemplateInfo(_id: string) {
    return {
      tempID: _id,
    };
  }

  async generateResumePdf({ resumeID, resumeData }: GeneratePdfDto) {
    if (
      !(resumeID || (resumeData && resumeData.template && resumeData.metaData))
    ) {
      throw new BadRequestException(
        'Either resumeID or template data must be provided.',
      );
    }
    let userMetaData = {};
    let templateData = {};
    if (resumeID) {
      const { metaData, templateId } =
        await this.resumesService.findById(resumeID);

      const { template } = await this.templatesService.findById(
        String(templateId),
      );
      userMetaData = metaData;
      templateData = template;
    } else {
      const { template, metaData } = resumeData;
      userMetaData = metaData;
      templateData = template;
    }

    const pdf = await this.puppeteerHelper.generatePDF(
      templateData,
      userMetaData,
    );
    // const filepath = path.resolve(__dirname, 'resume.pdf');
    // console.log('path: ', filepath);
    // fs.writeFileSync(filepath, pdf);
    return pdf;
  }
}
