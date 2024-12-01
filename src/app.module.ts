import { Module } from '@nestjs/common';
import { EmailsModule } from './emails/emails.module';
import { ConfigModule } from '@nestjs/config';
import { EnvConfiguration } from './config/app.config';
import { JoiValidationSchema } from './config/joi.validation';
import { CallsModule } from './calls/calls.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [EnvConfiguration],
      validationSchema: JoiValidationSchema,
      isGlobal: true,
    }),
    EmailsModule,
    CallsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
