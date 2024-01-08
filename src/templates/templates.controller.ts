import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { UploadService } from 'src/upload/upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserData } from 'src/decorator/request.decorator';

@Controller('templates')
export class TemplatesController {
  constructor(
    private readonly templatesService: TemplatesService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(@Req() req): Promise<any> {
    // Accessing files from the request
    let url = null;
    const file: Express.Multer.File = req.file;
    if (file) {
      const response = await this.uploadService.uploadToS3(file);
      url = response.url;
    }
    url = url ? url : '';
    const data = JSON.parse(req.body.data);
    const createTemplateDto: CreateTemplateDto = { ...data, thumbnail: url };

    return this.templatesService.create(createTemplateDto);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(@Param('id') id: string, @Req() req): Promise<any> {
    // Accessing files from the request
    let url = null;
    const file: Express.Multer.File = req.file;
    if (file) {
      const response = await this.uploadService.uploadToS3(file);
      url = response.url;
    }

    const data = JSON.parse(req.body.data);
    const updateTemplateDto: UpdateTemplateDto = data;
    if (url) {
      updateTemplateDto['thumbnail'] = url;
    }
    return this.templatesService.update(id, updateTemplateDto);
  }

  @Get(':id')
  findById(@Param('id') id: string): Promise<any> {
    return this.templatesService.findById(id);
  }

  @Get()
  findAll(): Promise<any> {
    return this.templatesService.findAll();
  }

  @Post('generate-pdf/:resumeID?')
  async generateResumePdf(
    @UserData('userID') userId: string,
    @Param('resumeID') resumeID: string,
    @Body() resumeData: any,
    @Res() res: any,
  ): Promise<any> {
    const pdfBuffer = await this.templatesService.generateResumePdf({
      userId,
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
