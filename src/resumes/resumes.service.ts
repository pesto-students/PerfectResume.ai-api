import { CreateResumeDto } from './dto/create-resume.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Resume } from './schemas/resume.schema';
import { Model, isValidObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateResumeDto } from './dto/update-resume.dto';

@Injectable()
export class ResumesService {
  constructor(@InjectModel(Resume.name) private resumeModel: Model<Resume>) {}

  async create(createResumeDto: CreateResumeDto): Promise<Resume> {
    const createdResume = new this.resumeModel(createResumeDto);
    return createdResume.save();
  }

  async update(id: string, updateResumeDto: UpdateResumeDto): Promise<Resume> {
    if (!isValidObjectId(id)) {
      throw new NotFoundException(`Invalid ID format: ${id}`);
    }
    const updatedResume = await this.resumeModel
      .findByIdAndUpdate(id, updateResumeDto, { new: true })
      .exec();

    if (!updatedResume) {
      throw new NotFoundException(`Template with ID: ${id} not found`);
    }
    return updatedResume;
  }

  async findById(id: string): Promise<Resume> {
    if (!isValidObjectId(id)) {
      throw new NotFoundException(`Invalid ID format: ${id}`);
    }
    const resume = await this.resumeModel.findById(id).exec();
    if (!resume) {
      throw new NotFoundException(`Resume with ID: ${id} not found`);
    }
    return resume;
  }

  async findAll(): Promise<Resume[]> {
    return this.resumeModel.find().exec();
  }
}
