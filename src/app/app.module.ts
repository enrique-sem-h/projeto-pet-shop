import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PetModule } from 'src/pet/pet.module';
import { TutorModule } from 'src/tutor/tutor.module';
import { DbModule } from 'src/db/db.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    PetModule,
    TutorModule,
    DbModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MailerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('MAIL_HOST'),
          port: configService.get<string>('MAIL_PORT'),
          secure: false,
        },
        defaults: {
          from: configService.get<string>('MAIL_FROM'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
