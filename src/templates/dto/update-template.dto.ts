import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateTemplateDto } from './create-template.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateTemplateDto extends PartialType(CreateTemplateDto) {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'id should not be empty' })
  id: string;
}
