import { Module } from '@nestjs/common';
import { SumsubauthService } from './sumsubauth.service';
import { SumsubauthController } from './sumsubauth.controller';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [SumsubauthController],
  providers: [SumsubauthService],
  imports: [
    ConfigModule.forRoot(),
    CommonModule
  ]
})
export class SumsubauthModule {}
