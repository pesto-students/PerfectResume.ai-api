import {
  Controller,
  Post,
  Body,
  Request,
  Response,
  Res,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { IsPublic } from '../decorator/public.decorator';
import { UserLoginDTO, UserSignupDTO } from './dto/auth.dto';

// poc: generate html to pdf
// poc: integrate openapi/chatgpt
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @IsPublic()
  @Post('login')
  async login(
    @Body() userData: UserLoginDTO,
    @Res({ passthrough: true }) res: any,
  ): Promise<any> {
    const userDetails = await this.authService.login(userData);
    res.cookie('accessToken', userDetails.accessToken);
    return userDetails;
  }

  @IsPublic()
  @Post('signup')
  async signup(
    @Body() userData: UserSignupDTO,
    @Response({ passthrough: true }) res: any,
  ): Promise<any> {
    await this.authService.signup(userData);
    const userDetails = await this.authService.login(userData);

    res.cookie('accessToken', userDetails.accessToken);
    return userDetails;
  }

  @IsPublic()
  @Post('logout')
  async logout(
    @Request() req: any,
    @Response({ passthrough: true }) res: any,
  ): Promise<any> {
    res.cookie('accessToken', '');
    return {
      logout: 'success',
    };
  }

  @IsPublic()
  @Post('forgotPassword')
  async forgotPassword(@Body() { email }: { email: string }): Promise<any> {
    const response = await this.authService.forgotPassword(email);
    return response;
  }

  @IsPublic()
  @Post('resetPassword/:token')
  async resetPassword(
    @Param('token') token: string,
    @Body() { password }: { password: string },
  ): Promise<any> {
    const response = await this.authService.resetPassword(token, password);
    return response;
  }
}
