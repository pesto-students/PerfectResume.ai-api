import { IsString, IsEmail, IsBoolean } from 'class-validator';

export class UserLoginDTO {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
export class UserSignupDTO extends UserLoginDTO {
  @IsBoolean()
  type: boolean;
}
