import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';
import { PromptWithConfigInfoDTO } from './dto/openai.dto';

@Injectable()
export class OpenAIService {
  openai;
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env['OPENAI_API_KEY'],
      dangerouslyAllowBrowser: true,
    });
  }
  async getPromptWithRespectToConfigInfo(data: PromptWithConfigInfoDTO) {
    const { config, text } = data;
    const schema = {
      type: 'object',
      overview: {
        type: 'array',
        description: 'Give 5 different version of the same text',
        items: {
          type: 'object',
          properties: {
            item: {
              type: 'string',
              description: 'reframe sentence'
            }
          }
        }
      }
    };
    const chatCompletion = await this.openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are a helpful resume reviewer who helps 
        people to correct and align their resume toward the job they are applying for`,
        },
        {
          role: 'user',
          content: `${config}\n Based on above information of job description of a company, 
          give the 5 different version of the below sentence which aligns with job description
           provided above and also keeps the sentence initial meaning.\n ${text}`,
        },
      ],
      model: 'gpt-3.5-turbo',
    });
    return chatCompletion.choices[0].message.content;
  }
}
