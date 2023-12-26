import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UserData } from 'src/decorator/request.decorator';
import { ResumeDto } from './dto/resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';

@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @Post()
  create(@UserData('userID') userID: string, @Body() resumeDto: ResumeDto) {
    const createResumeDto: CreateResumeDto = {
      ...resumeDto,
      userId: userID,
    };
    return this.resumesService.create(createResumeDto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateResumeDto: UpdateResumeDto,
  ): Promise<any> {
    return this.resumesService.update(id, updateResumeDto);
  }

  @Get(':id')
  findById(@Param('id') id: string): Promise<any> {
    return this.resumesService.findById(id);
  }

  @Get()
  findAll(@UserData('userID') userID: string): Promise<any> {
    return this.resumesService.findAll(userID);
  }
}
