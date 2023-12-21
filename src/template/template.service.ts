import { Injectable } from '@nestjs/common';

@Injectable()
export class TemplateService {
  getTemplateInfo(_id: string) {
    return {
      tempID: _id,
    };
  }

  async generateResumePdf(userID: string, resumeID: string) {
    console.log(userID, resumeID);
  }
}
