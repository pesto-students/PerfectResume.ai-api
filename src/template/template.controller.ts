import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { TemplateService } from './template.service';

@Controller('template')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Get(':tempID')
  async getTemplateInfo(@Param('tempID') tempID: string): Promise<any> {
    return this.templateService.getTemplateInfo(tempID);
  }

  @Post('generate-pdf/:resumeID?')
  async generateResumePdf(
    @Param('resumeID') resumeID: string,
    @Body() resumeData: any,
    @Res() res: any,
  ): Promise<any> {
    const pdfBuffer = await this.templateService.generateResumePdf({
      resumeID,
      resumeData,
    });
    // Set the correct headers to indicate content type and disposition (as an attachment)
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=download.pdf');

    // Send the PDF buffer
    res.send(pdfBuffer);
  }
}
