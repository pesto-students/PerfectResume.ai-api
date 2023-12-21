import { UpdateTemplateDto } from './dto/update-template.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Template } from './schemas/template.schema';
import { Model, isValidObjectId } from 'mongoose';
import { CreateTemplateDto } from './dto/create-template.dto';

@Injectable()
export class TemplatesService {
  constructor(
    @InjectModel(Template.name) private templateModel: Model<Template>,
  ) {}

  async create(createTemplateDto: CreateTemplateDto): Promise<Template> {
    const createdTemplate = new this.templateModel(createTemplateDto);
    return createdTemplate.save();
  }

  async update(updateTemplateDto: UpdateTemplateDto): Promise<Template> {
    const id = updateTemplateDto.id;
    if (!isValidObjectId(id)) {
      throw new NotFoundException(`Invalid ID format: ${id}`);
    }
    const updatedTemplate = await this.templateModel
      .findByIdAndUpdate(id, updateTemplateDto, { new: true })
      .exec();

    if (!updatedTemplate) {
      throw new NotFoundException(`Template with ID: ${id} not found`);
    }
    return updatedTemplate;
  }

  async findById(id: string): Promise<Template> {
    if (!isValidObjectId(id)) {
      throw new NotFoundException(`Invalid ID format: ${id}`);
    }
    const template = await this.templateModel.findById(id).exec();
    if (!template) {
      throw new NotFoundException(`Template with ID: ${id} not found`);
    }
    return template;
  }
  async findAll(): Promise<Template[]> {
    return this.templateModel.find().exec();
  }
}
