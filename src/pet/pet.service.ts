import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PetDTO } from '../dtos/pet.dto';
import { randomUUID } from 'node:crypto';

@Injectable()
export class PetService {
  private pets: PetDTO[] = [];

  create(pet: PetDTO) {
    pet.id = randomUUID();
    this.pets.push(pet);
    return 'success';
  }

  findAll() {
    return this.pets;
  }

  findById(id: string) {
    const pet = this.pets.filter((pet) => pet.id === id);

    if (pet.length) {
      return pet[0];
    }

    throw new NotFoundException(`Pet with id ${id} not found!`);
  }

  update(id: string, data: Omit<PetDTO, 'id'>) {
    let index = this.pets.findIndex((pet) => pet.id === id);

    if (index >= 0) {
      this.pets[index] = { ...data, id };
      return data;
    }

    throw new HttpException(
      `Pet with id ${id} not found`,
      HttpStatus.BAD_REQUEST,
    );
  }

  delete(id: string) {
    let index = this.pets.findIndex((pet) => pet.id === id);

    if (index >= 0) {
      this.pets.splice(index, 1);
      return `pet with id ${id} deleted successfully!`;
    }

    throw new HttpException(
      `Pet with id ${id} not found`,
      HttpStatus.BAD_REQUEST,
    );
  }
}
