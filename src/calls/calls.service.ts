import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StreamClient } from '@stream-io/node-sdk';

@Injectable()
export class CallsService {
  private client = new StreamClient(
    this.configService.get<string>('CHAT_API_KEY'),
    this.configService.get<string>('STREAM_API_SECRET'),
  );

  constructor(private readonly configService: ConfigService) {}


  async startTranscription(callId: string) {
    try {
      const call = this.client.video.call('default', callId)
      await call.update({
          settings_override: {
            transcription: {
              mode: 'auto-on',
              languages: ['es']
            }
          }
        }
      )
      await call.startTranscription();
      return {
        message: 'Transcription started successfully',
      };
    } catch (error) {
      console.log(error);
    }
  }

  async endTranscription(callId: string) {
    try {
      const call = this.client.video.call('default', callId)
      const transcription = await call.stopTranscription();
      console.log(transcription);
      return {
        message: 'Transcription stopped successfully',
        data: transcription,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async listTrancription(callId: string) {
    try {
      const call = this.client.video.call('default', callId)
      const transcription = await call.listTranscriptions();
      let transcriptions
      transcriptions = transcription.transcriptions.forEach((transcription) => {
        console.log(transcription.url);
      });
      return transcriptions;
    } catch (error) {
      console.log(error);
    }
  }
}
