import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { MailDto } from './dto/mail.dto';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(mailDto: MailDto): Promise<any> {
    const response = await this.mailerService.sendMail({
      ...mailDto,
      from: process.env.FROM_MAIL,
    });
    return response;
  }
}
