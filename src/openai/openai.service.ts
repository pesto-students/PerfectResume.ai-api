import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { OpenAI } from 'openai';
import { PromptWithConfigInfoDTO } from './dto/openai.dto';

@Injectable()
export class OpenAIService {
  openai;
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env['OPENAI_API_KEY'],
    });
  }
  async getPromptWithRespectToConfigInfo(data: PromptWithConfigInfoDTO) {
    const { config, text } = data;
    // prettier-ignore
    const schema = {
      type: 'object',
      required: ["versions", "items"],
      properties: {
        versions: {
          type: "array",
          description: "Generate 3 different versions of the context",
          items: {
            type: "string"
          }
        }
      }
    };

    const prompt = `${config}\n. Based on above information of job description of a company, 
      give  different version of the below sentence which aligns with job description.\n ${text}`;

    const chatCompletion = await this.openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are a helpful resume reviewer who helps 
          people to correct and align their resume toward the job they are applying for`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'gpt-3.5-turbo',
      functions: [{ name: 'resume_writer', parameters: schema }],
      function_call: { name: 'resume_writer' },
    });

    try {
      const response =
        chatCompletion.choices[0].message.function_call.arguments;
      return JSON.parse(response);
    } catch (error) {
      throw new UnprocessableEntityException();
    }
  }
}
