import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import { ConfigService } from '@nestjs/config';
import { CreateEmailDto } from './dto/create-email.dto';
import { CallsService } from 'src/calls/calls.service';

@Injectable()
export class EmailsService {
  constructor(
    private configService: ConfigService,
    private readonly callsService: CallsService,
  ) {}

  async sendEmail(createEmailDto: CreateEmailDto) {
    try {
      const { to, urlVideo, roomId } = createEmailDto;
      const resend = new Resend(
        this.configService.get<string>('RESEND_API_KEY'),
      );

      await this.callsService.listTranscription(roomId);



      const { data, error } = await resend.emails.send({
        from: 'lambda@emails.lambdaz.online',
        to: to,
        subject: 'El resumen de tu clase está listo!',
        html: `<p></p>`,
      });

      if (error) {
        console.log('erorr', error);
      }

      return {
        message: 'Email sent successfully',
        data,
      };
    } catch (error) {
      console.log(error);
    }
  }
}
