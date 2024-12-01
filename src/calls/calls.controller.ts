import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CallsService } from './calls.service';

@Controller('calls')
export class CallsController {
  constructor(private readonly callsService: CallsService) {}

  @Post('start-transcription/:callId')
  async create(@Param('callId') callId: string) {
    return await this.callsService.startTranscription(callId);
  }

  @Post('end-transcription/:callId')
  async endTranscription(@Param('callId') callId: string) {
    return await this.callsService.endTranscription(callId);
  }

  @Get('transcription/:callId')
  async findAll(@Param('callId') callId: string) {
    return await this.callsService.listTranscription(callId);
  }
}
