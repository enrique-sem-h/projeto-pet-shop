import { Module } from '@nestjs/common';
import { TutorService } from './tutor.service';
import { TutorController } from './tutor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TutorEntity } from 'src/db/entities/tutor.entity';

@Module({
  providers: [TutorService],
  imports: [TypeOrmModule.forFeature([TutorEntity])],
  controllers: [TutorController]
})
export class TutorModule {}
