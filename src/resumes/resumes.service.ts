import { CreateResumeDto } from './dto/create-resume.dto';
import {
  BadRequestException,
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

  async update(
    id: string,
    userId: string,
    updateResumeDto: UpdateResumeDto,
  ): Promise<Resume> {
    if (!isValidObjectId(id) || !isValidObjectId(userId)) {
      throw new BadRequestException('Invalid data');
    }
    const updatedResume = await this.resumeModel
      .findOneAndUpdate({ _id: id, userId }, updateResumeDto, { new: true })
      .exec();

    if (!updatedResume) {
      throw new NotFoundException(`Resume not found`);
    }
    return updatedResume;
  }

  async getResume(id: string, userId: string): Promise<Resume> {
    if (!isValidObjectId(id) || !isValidObjectId(userId)) {
      throw new BadRequestException('Invalid data');
    }
    const resume = await this.resumeModel
      .findOne({ _id: id, userId: userId })
      .exec();

    if (!resume) {
      throw new NotFoundException(`Resume Not found`);
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
