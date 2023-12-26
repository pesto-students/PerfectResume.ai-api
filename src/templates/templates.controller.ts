import {
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { UploadService } from 'src/upload/upload.service';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('templates')
export class TemplatesController {
  constructor(
    private readonly templatesService: TemplatesService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async create(@Req() req): Promise<any> {
    // Accessing files from the request
    let url = null;
    const files: Express.Multer.File[] = req.files;
    if (files && files.length) {
      const fileResponse = await this.uploadService.uploadFiles(files);
      if (fileResponse[0].data) {
        url = fileResponse[0].data.url;
      }
    }
    url = url ? url : '';
    const data = JSON.parse(req.body.data);
    const createTemplateDto: CreateTemplateDto = { ...data, thumbnail: url };

    return this.templatesService.create(createTemplateDto);
  }

  @Put(':id')
  @UseInterceptors(FilesInterceptor('files'))
  async update(@Param('id') id: string, @Req() req): Promise<any> {
    // Accessing files from the request
    let url = null;
    const files: Express.Multer.File[] = req.files;
    if (files && files.length) {
      const fileResponse = await this.uploadService.uploadFiles(files);
      if (fileResponse[0].data) {
        url = fileResponse[0].data.url;
      }
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
}
