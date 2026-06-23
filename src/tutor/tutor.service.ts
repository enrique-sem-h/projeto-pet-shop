import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { TutorDTO } from 'src/dtos/tutor.dto';

@Injectable()
export class TutorService {
  private tutors: TutorDTO[] = [];

  create(tutor: TutorDTO) {
    tutor.id = randomUUID();
    this.tutors.push(tutor);
    return 'success';
  }

  findAll() {
    return this.tutors;
  }

  findById(id: string) {
    const tutor = this.tutors.filter((tutor) => tutor.id === id);

    if (tutor.length) {
      return tutor[0];
    }

    throw new NotFoundException(`tutor with id ${id} not found!`);
  }

  update(id: string, data: Omit<TutorDTO, 'id'>) {
    let index = this.tutors.findIndex((tutor) => tutor.id === id);

    if (index >= 0) {
      this.tutors[index] = { ...data, id };
      return data;
    }

    throw new HttpException(
      `tutor with id ${id} not found`,
      HttpStatus.BAD_REQUEST,
    );
  }

  delete(id: string) {
    let index = this.tutors.findIndex((tutor) => tutor.id === id);

    if (index >= 0) {
      this.tutors.splice(index, 1);
      return `tutor with id ${id} deleted successfully!`;
    }

    throw new HttpException(
      `tutor with id ${id} not found`,
      HttpStatus.BAD_REQUEST,
    );
  }
}
