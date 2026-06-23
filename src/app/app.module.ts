import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PetModule } from 'src/pet/pet.module';
import { TutorModule } from 'src/tutor/tutor.module';

@Module({
  imports: [PetModule, TutorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
