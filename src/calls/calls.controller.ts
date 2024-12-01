import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CallsService } from './calls.service';

@Controller('calls')
export class CallsController {
  constructor(private readonly callsService: CallsService) {}

  @Post('startranscription/:callId')
  create(@Param('callId') callId: string) {
    return this.callsService.startTranscription(callId);
  }

  @Post('endtranscription/:callId')
  endTranscription(@Param('callId') callId: string) {
    return this.callsService.endTranscription(callId);
  }

  @Get('transcription/:callId')
  findAll(@Param('callId') callId: string) {
    return this.callsService.listTrancription(callId);
  }
}
