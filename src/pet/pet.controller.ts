import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PetDTO } from '../dtos/pet.dto';
import { PetService } from './pet.service';

@Controller('pets')
export class PetController {
  constructor(private readonly petServive: PetService) {}

  @Post()
  create(@Body() pet: PetDTO) {
    return this.petServive.create(pet);
  }

  @Get()
  findAll() {
    return this.petServive.findAll();
  }

  @Get('/:id')
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.petServive.findById(id);
  }

  @Patch('/:id')
  patchPet(@Param('id', ParseUUIDPipe) id: string, @Body() data: PetDTO) {
    return this.petServive.update(id, data);
  }

  @Delete('/:id')
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.petServive.delete(id);
  }
}
