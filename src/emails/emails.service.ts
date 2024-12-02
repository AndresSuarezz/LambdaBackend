import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import { ConfigService } from '@nestjs/config';
import { CreateEmailDto } from './dto/create-email.dto';
import { CallsService } from 'src/calls/calls.service';
import OpenAI from 'openai';

@Injectable()
export class EmailsService {
  private openai: OpenAI;

  constructor(
    private configService: ConfigService,
    private readonly callsService: CallsService,
  ) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPNENIA_API_KEY'),
      organization: this.configService.get<string>('OPENIA_ORGANIZATION_ID'),
      project: this.configService.get<string>('OPENIA_PROJECT_ID'),
    });
  }

  async sendEmail(createEmailDto: CreateEmailDto) {
    try {
      const { to, urlVideos, roomId } = createEmailDto;
      const resend = new Resend(
        this.configService.get<string>('RESEND_API_KEY'),
      );

      let videosHtml = '';
      videosHtml += '<div>';
      urlVideos.forEach((url) => {
        videosHtml += `
          <a href=${url}> Encuentra aqui tu clase grabada</a>
          `;
      });
      videosHtml += '</div>';

      const transcription = await this.callsService.listTranscription(roomId);

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `
 Rol del sistema:
 Eres un resumidor profesional especializado en procesar y analizar transcripciones de conversaciones en línea. Tu objetivo es sintetizar la información de manera precisa, clara y comprensible, destacando los temas tratados, los puntos clave y las oportunidades de mejora relacionadas con el contenido de la conversación, es importante que sepas que el texto lo va leer un estudiante que hizo parte de la conversacion y quiere saber mas del tema, destacar la informacion vista en clase, y aportar con informacion que le pueda ser util a la persona.

 Estructura de la transcripción:
 El formato de la información proporcionada es el siguiente:
 Cada línea incluye un guion (-), seguido del identificador del usuario y, finalmente, el contenido del mensaje separado por dos puntos (:). Por ejemplo:
 - guest-24640a89-83a4-42d0-8f18-e4d70d68f120-7o3iN7UALybbKsmzliCPYhrlaLC2: Hola, buenas noches.

 Instrucciones de salida:
 Debes estructurar tu respuesta utilizando el siguiente formato:

 Resumen de la conversación:
 [Aquí debes incluir un resumen preciso de los temas tratados y los puntos clave abordados durante la conversación.]

 Comentarios sobre la conversación:
 [Incluye observaciones generales, destacando aspectos positivos, enfoques interesantes o dinámicas relevantes.]

 Aspectos a mejorar para comprender el tema estudiado:
 [Identifica posibles dificultades en el contenido o la exposición del tema y proporciona sugerencias concretas para abordar estas áreas.]

 Recomendaciones para mejorar la comprensión del tema:
 [Proporciona recomendaciones prácticas y orientadas a ayudar a los participantes a comprender mejor el tema tratado,enfoca el texto para que la persona que vaya a leer esto pueda adquirir mas información del tema.]

 Pautas adicionales:

 Es OBLIGATORIO el uso emoticones para hacer el resumen más amigable y atractivo, siempre que estos sean pertinentes y no comprometan la claridad o profesionalismo del mensaje. Ejemplo de emoticones: ⭐✅👍👎👌👏👀🧐🤓🤩🚀😥.
 Mantén un tono objetivo, imparcial y profesional en todo momento.
 No incluyas agradecimientos, saludos o despedidas en la respuesta; solo entrega la información solicitada según las instrucciones.
 [OBLIGATORIO] La respuesta da en formato html, desde el un div hasta el final del div, es decir devolver el HTML dentro de ese div, no incluyas el head ni el html.
 Por ultimo siempre al terminar todo escibe este mensaje "Gracias por usar Lambda ¡Espero que esta información te sea útil! 😊🚀🌟".
             `,
          },
          { role: 'user', content: `${transcription}` },
        ],
      });

      const callSummary = completion.choices[0].message.content;

      const email = `<div>
      ${callSummary}
      ${videosHtml}
      </div>`;
      console.log('Video',videosHtml)
      console.log(email)

      const { data, error } = await resend.emails.send({
        from: 'lambda@emails.lambdaz.online',
        to: to,
        subject: 'El resumen de tu clase está listo!',
        html: email,
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
