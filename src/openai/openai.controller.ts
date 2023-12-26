import { Controller, Get } from '@nestjs/common';
import { OpenAIService } from './openai.service';
import { IsPublic } from 'src/decorator/public.decorator';

@Controller('openai')
export class OpenAIController {
  constructor(private readonly openAIService: OpenAIService) {}

  @IsPublic()
  @Get()
  async getUserInfo(): Promise<any> {
    return this.openAIService.get();
  }
}
