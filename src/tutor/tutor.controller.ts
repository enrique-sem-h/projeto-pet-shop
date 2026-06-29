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
  create(@Body() tutor: TutorDTO) {
    return this.tutorService.create(tutor);
  }

  @Get()
  findAll() {
    return this.tutorService.findAll();
  }

  @Get('/:id')
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.tutorService.findBy({ id: id });
  }

  @Patch('/:id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() data: TutorDTO) {
    return this.tutorService.update(id, data);
  }

  @Delete('/:id')
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.tutorService.delete(id);
  }
}
