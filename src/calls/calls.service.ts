import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StreamClient } from '@stream-io/node-sdk';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';
import {
  ResponseUrl,
  ResponseUrls,
} from './interfaces/response-urls.interface';

@Injectable()
export class CallsService {
  private client: StreamClient;

  constructor(
    private readonly configService: ConfigService,
    private readonly http: AxiosAdapter,
  ) {
    this.client = new StreamClient(
      this.configService.get<string>('CHAT_API_KEY'),
      this.configService.get<string>('STREAM_API_SECRET'),
    );
  }

  async startTranscription(callId: string) {
    try {
      const call = this.client.video.call('default', callId);
      await call.update({
        settings_override: {
          transcription: {
            mode: 'available',
            languages: ['es'],
          },
        },
      });
      await call.startTranscription();

      return {
        message: 'Transcription started successfully',
      };
    } catch (error) {
      throw new BadRequestException('Failed to start transcription', error);
    }
  }

  async endTranscription(callId: string) {
    try {
      const call = this.client.video.call('default', callId);
      const transcription = await call.stopTranscription();
      return {
        message: 'Transcription stopped successfully',
        data: transcription,
      };
    } catch (error) {
      throw new BadRequestException('Failed to stop transcription', error);
    }
  }

  async listTranscription(callId: string) {
    try {
      const call = this.client.video.call('default', callId);

      const transcription = await call.listTranscriptions();
      const urls = transcription.transcriptions.map(
        (transcription) => transcription.url,
      );

      const responses = await Promise.all(
        urls.map(async (url) => {
          try {
            const response = await this.http.get(url);
            return this.convertirTextoAJson(response); // Convertir texto plano a JSON
          } catch (err) {
            console.error(`Failed to process URL ${url}:`, err);
            return {
              error: `Failed to fetch or process transcription from ${url}`,
              details: err.message,
            };
          }
        }),
      );

      const validResponses = responses.filter((response) => !response.error);

      let mapiao = '';
      validResponses.map((response) => {
        response.map((res) => {
          mapiao += `- ${res.speaker_id}: ${res.text}`;
        });
      });
      mapiao = this.limpiarSaltosDeLinea(mapiao);
      console.log(mapiao);
      // Estructurar el resultado final
      return mapiao;
      const result = {
        callId,
        responses: validResponses,
        mapiao,
        errors: responses.filter((response) => response.error), // Incluir errores si los hay
      };

      return result;
    } catch (error) {
      console.error('Error listing transcriptions:', error);
      throw new BadRequestException('Failed to list transcriptions', error);
    }
  }

  private convertirTextoAJson(texto) {
    const jsonList = texto
      .trim()
      .split('\n')
      .map((line) => {
        return JSON.parse(line.trim());
      });

    return jsonList;
  }

  private limpiarSaltosDeLinea(texto) {
    return (
      texto
        // Reemplaza saltos de línea que no siguen a un punto con un espacio
        .replace(/([^\.\n])\n+/g, '$1 ')
        // Limpia saltos de línea redundantes al final o al inicio
        .trim()
    );
  }
}
