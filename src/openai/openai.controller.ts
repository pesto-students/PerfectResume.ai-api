import { Body, Controller, Post } from '@nestjs/common';
import { OpenAIService } from './openai.service';
import { IsPublic } from 'src/decorator/public.decorator';
import { PromptWithConfigInfoDTO } from './dto/openai.dto';

@Controller('openai')
export class OpenAIController {
  constructor(private readonly openAIService: OpenAIService) {}

  @IsPublic()
  @Post('prompt')
  async getPromptWithRespectToConfigInfo(
    @Body() body: PromptWithConfigInfoDTO
  ): Promise<any> {
    return this.openAIService.getPromptWithRespectToConfigInfo(body);
  }
}
