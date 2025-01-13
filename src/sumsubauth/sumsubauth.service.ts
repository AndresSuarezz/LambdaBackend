import * as crypto from 'crypto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';
import { CreateSumsubauthDto } from './dto/create-sumsubauth.dto';
import { responseSumSub } from './interface/responseSumSub.interface';
import axios from 'axios';

@Injectable()
export class SumsubauthService {
  constructor(
    private readonly axios: AxiosAdapter,
    private readonly configService: ConfigService,
  ) {}

  async createToken(createSumsubauthDto: CreateSumsubauthDto): Promise<responseSumSub> {
    const { levelName, userId } = createSumsubauthDto;

    const baseUrl = 'https://api.sumsub.com';
    const url = '/resources/accessTokens/sdk';
    const method = 'POST';
    const ts = Math.floor(Date.now() / 1000);
    const ttlInSecs = 600;

    const body = JSON.stringify({ ttlInSecs, userId, levelName });

    const dataToSign = ts + method + url + body;

    const secretKey = this.configService.get<string>('SUMSUB_SECRET_KEY');

    const signature = crypto
      .createHmac('sha256', secretKey)
      .update(dataToSign)
      .digest('hex');

    const headers = {
      'Content-Type': 'application/json',
      'X-App-Token': this.configService.get<string>('SUMSUB_TOKEN'),
      'X-App-Access-Sig': signature,
      'X-App-Access-Ts': ts.toString(),
    };

    try {
      const response = await axios.post<responseSumSub>(
        `${baseUrl}${url}`,
        { ttlInSecs, userId, levelName },
        { headers },
      );

      return response.data; // Retorna el token y otros datos
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('if => ', error);
        throw new BadRequestException('Invalid credentials');
      }
      console.log(error);
      throw new BadRequestException('Failed to create token');
    }
  }
}
