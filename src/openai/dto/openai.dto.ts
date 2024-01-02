import { UnprocessableEntityException } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Length } from 'class-validator';

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
  @IsNotEmpty()
  @Length(1, 255, { message: 'Text must be between 1 and 255 characters long' })
  text: string;

  @Transform((obj) => {
    if (typeof obj.value === 'string') {
      const sentence = obj.value.trim();
      if (sentence.length > 0) {
        return sentence;
      }
      throw new UnprocessableEntityException('Please Pass a Valid Config');
    }
    throw new UnprocessableEntityException('Expected Config to be a String');
  })
  @IsString()
  @IsNotEmpty()
  @Length(10, 50000, {
    message: 'Config must be between 10 and 50000 characters long',
  })
  config: string;
}
