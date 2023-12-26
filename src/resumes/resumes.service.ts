import { CreateResumeDto } from './dto/create-resume.dto';
import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Resume } from './schemas/resume.schema';
import { Model, isValidObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateResumeDto } from './dto/update-resume.dto';

@Injectable()
export class ResumesService {
  constructor(@InjectModel(Resume.name) private resumeModel: Model<Resume>) {}

  async create(createResumeDto: CreateResumeDto): Promise<Resume> {
    const isResumeWithNameAlreadyExists = await this.resumeModel.findOne({
      name: createResumeDto.name,
      userId: createResumeDto.userId,
    });
    if (isResumeWithNameAlreadyExists) {
      throw new UnprocessableEntityException(
        'Resume with same name already exits!!',
      );
    }
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
  async findByUserId(userID: string): Promise<Resume[]> {
    if (!isValidObjectId(userID)) {
      throw new NotFoundException(`Invalid ID format: ${userID}`);
    }
    return this.resumeModel.find({ userId: userID }).exec();
  }

  async findAll(userId: string): Promise<Resume[]> {
    return this.resumeModel.find({ userId }).exec();
  }
}
