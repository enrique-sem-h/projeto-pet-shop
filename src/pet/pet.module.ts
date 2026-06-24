import { Module } from '@nestjs/common';
import { PetController } from './pet.controller';
import { PetService } from './pet.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PetEntity } from 'src/db/entities/pet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PetEntity])],
  controllers: [PetController],
  providers: [PetService],
})
export class PetModule {}
