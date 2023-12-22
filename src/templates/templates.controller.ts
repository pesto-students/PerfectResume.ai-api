import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';

@Controller('templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Post()
  create(@Body() createTemplateDto: CreateTemplateDto): Promise<any> {
    return this.templatesService.create(createTemplateDto);
  }

  @Put(':id')
  update(@Body() updateTemplateDto: UpdateTemplateDto): Promise<any> {
    return this.templatesService.update(updateTemplateDto);
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
