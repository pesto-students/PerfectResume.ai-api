import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class MailDto {
  @IsString()
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'To Mail should not be empty' })
  to: string;

  @IsString()
  @IsNotEmpty({ message: 'Subject should not be empty' })
  subject: string;

  @IsString()
  @IsNotEmpty({ message: 'text should not be empty' })
  text: string;
}
