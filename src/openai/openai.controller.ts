import { Controller, Get } from '@nestjs/common';
import { OpenAIService } from './openai.service';
import { isPublic } from 'src/decorator/public.decorator';

@Controller('openai')
export class OpenAIController {
  constructor(private readonly openAIService: OpenAIService) {}

  @isPublic()
  @Get()
  async getUserInfo(): Promise<any> {
    return this.openAIService.get();
  }
}
