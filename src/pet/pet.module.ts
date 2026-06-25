import { Module } from '@nestjs/common';
import { PetController } from './pet.controller';
import { PetService } from './pet.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PetEntity } from 'src/db/entities/pet.entity';
import { TutorModule } from 'src/tutor/tutor.module';

@Module({
  imports: [TypeOrmModule.forFeature([PetEntity]), TutorModule],
  controllers: [PetController],
  providers: [PetService],
})
export class PetModule {}
