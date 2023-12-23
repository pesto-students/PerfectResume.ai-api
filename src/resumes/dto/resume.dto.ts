import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class ResumeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Name should not be empty' })
  name: string;

  @ApiProperty()
  @IsObject()
  @IsNotEmpty({ message: 'Meta Data should not be empty' })
  metaData: object;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isPrivate: boolean;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Template Id is missing' })
  templateId: string;
}
