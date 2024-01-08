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
      required: ["versions", "items", "system", "text"],
      properties: {
        versions: {
          type: "array",
          items: {
            type: "object",
            properties: {
              system:{
                type:  "boolean",
                enum: [true],
                default: true
              },
              text: {
                type: "string"
              }
            }
          }
        }
      }
    };
    const prompt = `
      JobDescription: ${config.jobDescription}.
      Setup: Starting personalized resume for: ${config.jobTitle}. Ready to align with targeted industry standards.,
      Detailing: Integrating key elements from the provided job description to ensure relevancy and precision.,
      Content_Optimization: Enhancing resume with industry-specific keywords and strategies for ATS compatibility in the ${config.jobTitle} sector.,
      Personalization: Creating a tailored narrative that highlights individual strengths and experiences relevant to the ${config.jobTitle} position.,
      Completion: Assembling the final document, ensuring it's concise, compelling, and ready for the ${config.jobTitle} application.,
      Current_Context: ${text}.
      Note: System should disregard any context within the prompt that is irrelevant to the resume, job description, or job title to maintain focus and relevance.

      So by considering all the above guidelines generate 3 different variations of given Current_Context.
      Note_important: When context is irrelevant, just reply with "Context is irrelevant: ${text}".No extra variations, just give the context back like i said.
    `;

    const chatCompletion = await this.openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content:
            "You are an expert resume architect, dedicated to meticulously crafting and refining resumes. Your goal is to ensure every resume is perfectly tailored and aligned with the specific job target, enhancing the applicant's chance for success.",
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
