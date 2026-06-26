import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PetDTO } from '../dtos/pet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PetEntity } from 'src/db/entities/pet.entity';
import { TutorService } from 'src/tutor/tutor.service';

@Injectable()
export class PetService {
  constructor(
    @InjectRepository(PetEntity)
    private readonly petsRepository: Repository<PetEntity>,
    private readonly tutorService: TutorService,
  ) {}

  async create(pet: PetDTO): Promise<Partial<PetDTO> | null> {
    const found = await this.findByTutor(pet.tutorId);

    // verify if said pet already exists
    if (found && found.some((p) => p.name === pet.name)) {
      throw new ConflictException(
        `Pet ${pet.name} already registered for tutor`,
      );
    }

    const tutor = await this.tutorService.findBy({ id: pet.tutorId });

    try {
      // insert pet
      const newPet = new PetEntity();
      newPet.name = pet.name;
      newPet.species = pet.species;
      newPet.breed = pet.breed;
      newPet.age = pet.age;
      newPet.tutorId = pet.tutorId;

      const { id, name } = await this.petsRepository.save(newPet);
      return { id, name };
    } catch {
      throw new BadRequestException(
        'Unable to save new pet, please check tutorId',
      );
    }
  }

  async findAll(): Promise<PetDTO[] | null> {
    return await this.petsRepository.find();
  }

  async findById(id: string): Promise<PetDTO | null> {
    const found = await this.petsRepository.findOne({
      where: { id: id },
    });

    if (found) {
      return found;
    }

    throw new NotFoundException(`Pet with id ${id} not found!`);
  }

  async findByTutor(tutorId: string): Promise<PetDTO[] | null> {
    const found = await this.petsRepository.find({
      where: { tutorId: tutorId },
    });

    if (found) {
      return found;
    }

    throw new NotFoundException(`Tutor with id ${tutorId} not found!`);
  }

  async update(petId: string, data: PetDTO): Promise<PetDTO | null> {
    const found = await this.findById(petId);

    if (!found) {
      throw new NotFoundException(`Pet not found!`);
    }

    const { id, tutorId, ...updateData } = data;

    const result = await this.petsRepository.update(found.id, updateData);

    return result.affected
      ? { id: petId, ...updateData, tutorId: found.tutorId }
      : null;
  }

  async delete(id: string): Promise<PetDTO | null> {
    const found = await this.findById(id);

    if (!found) {
      throw new NotFoundException(`Pet not Found!`);
    }

    await this.petsRepository.delete(id);
    return found;
  }
}
