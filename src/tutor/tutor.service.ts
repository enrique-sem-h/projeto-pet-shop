import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TutorEntity } from 'src/db/entities/tutor.entity';
import { PetDTO } from 'src/dtos/pet.dto';
import { Identifier, TutorDTO } from 'src/dtos/tutor.dto';
import { Repository } from 'typeorm';

@Injectable()
export class TutorService {
  constructor(
    @InjectRepository(TutorEntity)
    private readonly tutorsRepository: Repository<TutorEntity>,
  ) {}

  // creates a new tutor in the database if not exists
  async create(tutor: TutorDTO) {
    let registered: TutorDTO | null = null;
    try {
      registered = await this.findBy({ email: tutor.email });
    } catch {}

    if (registered) {
      throw new ConflictException(`${tutor.email} is already registered`);
    }
    const newTutor = new TutorEntity();
    newTutor.name = tutor.name;
    newTutor.email = tutor.email;
    newTutor.age = tutor.age;

    const { id, email } = await this.tutorsRepository.save(newTutor);

    return { id, email };
  }

  // returns all records for tutors
  async findAll(): Promise<TutorDTO[]> {
    const tutors = await this.tutorsRepository.find();

    return tutors;
  }

  // finds a tutor in the db by id or email
  async findBy(identifier: Identifier): Promise<TutorDTO | null> {
    if (!identifier.id && !identifier.email) {
      throw new BadRequestException('Please inform id or email');
    }

    const found = await this.tutorsRepository.findOne({
      where: [{ id: identifier.id }, { email: identifier.email }],
      relations: {
        pets: true,
      },
    });

    if (found) {
      // const pets = await this.findPets(found.id);
      return {
        id: found.id,
        age: found.age,
        email: found.email,
        name: found.name,
        pets: found.pets ?? [],
      };
    }

    throw new NotFoundException('Tutor not found! check fields and try again');
  }

  async update(
    tutorId: string,
    data: Partial<TutorDTO>,
  ): Promise<Partial<TutorDTO> | null> {
    let found: TutorDTO | null = null;
    try {
      found = await this.findBy({ id: tutorId });
    } catch { }
    
    if (!found) {
      throw new NotFoundException(`tutor ${tutorId} not found!`);
    }

    const { id, ...updateData } = data;

    const result = await this.tutorsRepository.update(found.id, updateData);

    if (result.affected) {
      return { id: tutorId, ...updateData };
    }

    throw new InternalServerErrorException(
      'Houve um erro, por favor tente novamente',
    );
  }

  async delete(id: string): Promise<TutorDTO | null> {
    const found = await this.findBy({ id: id });

    if (!found) {
      throw new NotFoundException(`tutor ${id} not found!`);
    }

    await this.tutorsRepository.delete(id);
    return found;
  }

  private async findPets(tutorId: string): Promise<PetDTO[] | null> {
    const query = this.tutorsRepository
      .createQueryBuilder('tutor')
      .leftJoinAndSelect('tutor.pets', 'pet')
      .where('tutor.id = :tutorId', { tutorId });

    const result = await query.getRawOne();

    if (result) {
      return result.pets;
    }

    return null;
  }
}
