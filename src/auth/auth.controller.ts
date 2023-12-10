import { Controller, Post, Body, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { isPublic } from '../decorator/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @isPublic()
  @Post('login')
  async login(
    @Body() body: { username: string; password: string },
  ): Promise<{ access_token: string }> {
    return this.authService.login(body);
  }

  @isPublic()
  @Post('signup')
  async signup(@Request() req: any): Promise<{ access_token: string }> {
    const user = await this.authService.signup(req.body);
    return this.authService.login(user);
  }
}
