import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTemplateDto {
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
  isActive: boolean;

  @ApiProperty()
  @IsObject()
  @IsNotEmpty({ message: 'Form Schema should not be empty' })
  formSchema: object;

  @ApiProperty()
  @IsObject()
  @IsNotEmpty({ message: 'Template should not be empty' })
  template: object;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'thumbnail url is missing' })
  thumbnail: string;
}
