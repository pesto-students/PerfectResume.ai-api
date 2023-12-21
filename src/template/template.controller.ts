import { Controller, Get, Post, Param } from '@nestjs/common';
import { TemplateService } from './template.service';
import { UserData } from 'src/decorator/request.decorator';

@Controller('template')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Get(':tempID')
  async getTemplateInfo(@Param('tempID') tempID: string): Promise<any> {
    return this.templateService.getTemplateInfo(tempID);
  }

  @Post('generate-pdf/:resumeID')
  async generateResumePdf(
    @UserData('userID') userID: string,
    @Param('resumeID') resumeID: string,
  ): Promise<any> {
    return this.templateService.generateResumePdf(userID, resumeID);
  }
}
