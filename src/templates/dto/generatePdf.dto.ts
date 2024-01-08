import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class ResumeDataDto {
  @IsObject()
  @IsNotEmpty()
  template: object;

  @IsObject()
  @IsNotEmpty()
  metaData: object;
}

export class GeneratePdfDto {
  @IsOptional()
  @IsString()
  resumeID?: string;

  @IsString()
  userId?: string;

  @IsObject()
  @ValidateNested()
  @Type(() => ResumeDataDto)
  resumeData?: ResumeDataDto;
}
