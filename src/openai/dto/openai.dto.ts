import { UnprocessableEntityException } from '@nestjs/common';
import { Transform, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

class ConfigDto {
  @IsString()
  @IsOptional()
  @Length(0, 250, {
    message: 'Job Title should not be more than 250 characters long',
  })
  jobTitle: string;

  @IsString()
  @IsOptional()
  @Length(0, 1000, {
    message: 'Job Description should not be more than 1000 characters long',
  })
  jobDescription: string;
}
export class PromptWithConfigInfoDTO {
  @Transform((obj) => {
    if (typeof obj.value === 'string') {
      const sentence = obj.value.trim();
      if (sentence.length > 0) {
        return sentence;
      }
      throw new UnprocessableEntityException('Please Pass a Valid Text');
    }
    throw new UnprocessableEntityException('Expected Text to be a String');
  })
  @IsString()
  @IsNotEmpty({
    message: 'Context should not be empty',
  })
  @MinLength(10, { message: 'Context should be atleast 10 characters long' })
  @MaxLength(500, {
    message: 'Context should not be more than 500 characters long',
  })
  text: string;

  @IsObject()
  @ValidateNested()
  @Type(() => ConfigDto)
  config?: ConfigDto;
}
