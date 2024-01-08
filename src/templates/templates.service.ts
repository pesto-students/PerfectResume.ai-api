import { UpdateTemplateDto } from './dto/update-template.dto';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Template } from './schemas/template.schema';
import { Model, isValidObjectId } from 'mongoose';
import { CreateTemplateDto } from './dto/create-template.dto';
import { ResumesService } from 'src/resumes/resumes.service';
import { PuppeteerHelper } from './helpers/puppeteer.helper';
import { GeneratePdfDto } from './dto/generatePdf.dto';

@Injectable()
export class TemplatesService {
  @Inject()
  private readonly puppeteerHelper: PuppeteerHelper;
  constructor(
    @InjectModel(Template.name) private templateModel: Model<Template>,
    private readonly resumesService: ResumesService,
  ) {}

  async create(createTemplateDto: CreateTemplateDto): Promise<Template> {
    const createdTemplate = new this.templateModel(createTemplateDto);
    return createdTemplate.save();
  }

  async update(
    id: string,
    updateTemplateDto: UpdateTemplateDto,
  ): Promise<Template> {
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

  async generateResumePdf({ userId, resumeID, resumeData }: GeneratePdfDto) {
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
      const { metaData, templateId } = await this.resumesService.getResume(
        resumeID,
        userId,
      );

      const { template } = await this.findById(String(templateId));
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
