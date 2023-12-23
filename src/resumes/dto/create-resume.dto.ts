import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { ResumeDto } from './resume.dto';

export class CreateResumeDto extends ResumeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'User Id is missing' })
  userId: string;
}
