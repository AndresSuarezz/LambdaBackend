import {
  Controller,
  Post,
  Body,
} from '@nestjs/common';
import { SumsubauthService } from './sumsubauth.service';
import { CreateSumsubauthDto } from './dto/create-sumsubauth.dto';
import { responseSumSub } from './interface/responseSumSub.interface';

@Controller('sumsubauth')
export class SumsubauthController {
  constructor(private readonly sumsubauthService: SumsubauthService) {}

  @Post('generate')
  createToken(
    @Body() createSumsubauthDto: CreateSumsubauthDto,
  ): Promise<responseSumSub> {
    return this.sumsubauthService.createToken(createSumsubauthDto);
  }
}
