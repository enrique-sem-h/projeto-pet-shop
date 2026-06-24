import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TutorEntity } from 'src/db/entities/tutor.entity';
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
    try {
      const registered = await this.findBy({ email: tutor.email });

      if (registered) {
        throw new ConflictException(`Tutor ${tutor.email} already registered`);
      }
    } catch {
      console.log('chegou aqui');
      const newTutor = new TutorEntity();
      newTutor.name = tutor.name;
      newTutor.email = tutor.email;
      newTutor.age = tutor.age;
      console.log(newTutor);

      const { id, email } = await this.tutorsRepository.save(newTutor);

      return { id, email };
    }
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

    try {
      const found = await this.tutorsRepository.findOne({
        where: [{ id: identifier.id }, { email: identifier.email }],
      });

      if (found) {
        return {
          id: found.id,
          age: found.age,
          email: found.email,
          name: found.name,
        };
      }
    } catch {
      throw new NotFoundException(`Tutor not found!`);
    }

    throw new InternalServerErrorException(
      'Something happened on our end, please try again!',
    );
  }

  async update(tutorId: string, data: TutorDTO): Promise<TutorDTO | null> {
    const found = await this.findBy({ id: tutorId });

    if (!found) {
      throw new NotFoundException(`tutor ${data.email} not found!`);
    }

    const { id, ...updateData } = data;

    const result = await this.tutorsRepository.update(found.id, updateData);

    return result.affected ? { id: tutorId, ...updateData } : null;
  }

  async delete(id: string): Promise<TutorDTO | null> {
    const found = await this.findBy({ id: id });

    if (!found) {
      throw new NotFoundException(`tutor ${id} not found!`);
    }

    await this.tutorsRepository.delete(id);
    return found;
  }
}
