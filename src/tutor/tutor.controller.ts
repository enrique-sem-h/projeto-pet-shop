import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { TutorService } from './tutor.service';
import { TutorDTO } from 'src/dtos/tutor.dto';

@Controller('tutors')
export class TutorController {
  constructor(private readonly tutorService: TutorService) {}

  @Post()
  async create(@Body() tutor: TutorDTO) {
    return await this.tutorService.create(tutor);
  }

  @Get()
  async findAll() {
    return await this.tutorService.findAll();
  }

  @Get('/:id')
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.tutorService.findBy({ id: id });
  }

  @Patch('/:id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() data: Partial<TutorDTO>) {
    return await this.tutorService.update(id, data);
  }

  @Delete('/:id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.tutorService.delete(id);
  }
}
