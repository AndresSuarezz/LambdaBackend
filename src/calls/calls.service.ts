import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StreamClient } from '@stream-io/node-sdk';

@Injectable()
export class CallsService {
  private client: StreamClient;

  constructor(private readonly configService: ConfigService) {
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
              mode: 'auto-on',
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

  async listTrancription(callId: string) {
    try {
      const call = this.client.video.call('default', callId);
      const transcription = await call.listTranscriptions();
      const urls = transcription.transcriptions.map((transcription) => {
        return transcription.url;
      });
      return urls;
    } catch (error) {
      throw new BadRequestException('Failed to list transcriptions', error);
    }
  }
}
