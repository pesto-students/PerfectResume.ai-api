import { UnprocessableEntityException } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsString, IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class UserLoginDTO {
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}

export class UserSignupDTO extends UserLoginDTO {
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @Transform((obj) => {
    if (obj && typeof obj.value === 'boolean') {
      return obj.value ? 'MEMBER' : 'NORMAL';
    }
    throw new UnprocessableEntityException('Invalid User Type');
  })
  @IsNotEmpty({ message: 'type is required' })
  @IsString()
  userType: string;
}
