import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';

@Injectable()
export class OpenAIService {
  openai;
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env['OPENAI_API_KEY'],
    });
  }
  async get() {
    const chatCompletion = await this.openai.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: `reframe this sentense in 5 different ways. \n
      build an integrated chat system result in product revenuce increase by 80 percent. \n
      return in valid JSON array format only`,
        },
      ],
      model: 'gpt-3.5-turbo',
      functions: [
        {
          name: 'getName',
          parameters: {
            type: 'object',
            properties: {},
          },
        },
      ],
      function_call: { name: 'getName' },
    });
    console.log(chatCompletion.choices[0].message);
    JSON.parse(chatCompletion.choices[0].message.content);
    return chatCompletion;
  }
}
