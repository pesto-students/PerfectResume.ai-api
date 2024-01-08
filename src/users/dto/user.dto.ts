export class ForgotPasswordDto {
  email: string;
  forgotPasswordToken: string;
  forgotPasswordExpiry: Date;
}
