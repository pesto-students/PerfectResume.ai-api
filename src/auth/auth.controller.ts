import { Controller, Post, Body, Request, Response, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { isPublic } from '../decorator/public.decorator';
import { UserLoginDTO } from './dto/auth.dto';

// poc: generate html to pdf
// poc: integrate openapi/chatgpt
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @isPublic()
  @Post('login')
  async login(
    @Body() userData: UserLoginDTO,
    @Res({ passthrough: true }) res: any,
  ): Promise<any> {
    const userDetails = await this.authService.login(userData);
    res.cookie('accessToken', userDetails.accessToken);
    return userDetails;
  }

  @isPublic()
  @Post('signup')
  async signup(
    @Body() userData: UserLoginDTO,
    @Response({ passthrough: true }) res: any,
  ): Promise<any> {
    const newUser = await this.authService.signup(userData);
    const userDetails = await this.authService.login(newUser);

    res.cookie('accessToken', userDetails.accessToken);
    return userDetails;
  }

  @isPublic()
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
}
