import { Module } from '@nestjs/common';
import { EmailsService } from './emails.service';
import { EmailsController } from './emails.controller';
import { ConfigModule } from '@nestjs/config';
import { CallsModule } from 'src/calls/calls.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [ConfigModule.forRoot(), CallsModule, CommonModule],
  controllers: [EmailsController],
  providers: [EmailsService],
})
export class EmailsModule {}
