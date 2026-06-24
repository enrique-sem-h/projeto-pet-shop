import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PetModule } from 'src/pet/pet.module';
import { TutorModule } from 'src/tutor/tutor.module';
import { DbModule } from 'src/db/db.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    PetModule,
    TutorModule,
    DbModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
