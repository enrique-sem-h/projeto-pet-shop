import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PetEntity } from 'src/db/entities/pet.entity';
import { TutorEntity } from 'src/db/entities/tutor.entity';
import { PetDTO } from 'src/dtos/pet.dto';
import { TutorDTO } from 'src/dtos/tutor.dto';
import { PetModule } from 'src/pet/pet.module';
import { PetService } from 'src/pet/pet.service';
import { Repository } from 'typeorm';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('integration between Pet and Tutor modules', () => {
  let petService: PetService;
  let petRepositoryMock: MockRepository<PetEntity>;
  let tutorRepositoryMock: MockRepository<TutorEntity>;

  const mockedTutor: TutorDTO = {
    id: 'tutor-uuid',
    name: 'Mock Jackson',
    email: 'mock@email.com',
    age: 26,
    pets: [],
  };

  const mockedPet: PetDTO = {
    id: 'pet-uuid',
    name: 'Stringy',
    species: 'Dog',
    breed: 'Hotweiller',
    age: 2,
    tutorId: 'tutor-uuid',
  };

  beforeEach(async () => {
    petRepositoryMock = {
      findOne: jest.fn().mockResolvedValue(mockedPet),
      save: jest.fn().mockResolvedValue(mockedPet),
      find: jest.fn().mockResolvedValue([mockedPet]),
    };
    tutorRepositoryMock = {
      findOne: jest.fn().mockResolvedValue(mockedTutor),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PetModule],
    })
      .overrideProvider(getRepositoryToken(PetEntity))
      .useValue(petRepositoryMock)
      .overrideProvider(getRepositoryToken(TutorEntity))
      .useValue(tutorRepositoryMock)
      .compile();

    petService = moduleFixture.get<PetService>(PetService);
  });

  it('should be defined', () => {
    expect(petService).toBeDefined();
  });

  it('should create a pet if tutor exists', async () => {
    petRepositoryMock.find?.mockResolvedValue([]);

    const result = await petService.create(mockedPet);

    expect(result).toEqual({ id: mockedPet.id, name: mockedPet.name });
  });

  it('should create a pet even if tutor has other pets', async () => {
    petRepositoryMock.find?.mockResolvedValue([
      {
        ...mockedPet,
        name: 'Doggy',
      },
    ]);

    const result = await petService.create(mockedPet);

    expect(result).toEqual({ id: mockedPet.id, name: mockedPet.name });
    expect(petRepositoryMock.save).toHaveBeenCalledTimes(1);
  });

  it('should throw a not found if tutor does not exist', async () => {
    petRepositoryMock.find?.mockResolvedValue([]);
    tutorRepositoryMock.findOne?.mockResolvedValue(null);

    expect(petService.create(mockedPet)).rejects.toThrow(NotFoundException);
  });

  it('should throw a conflict if pet is already created', async () => {
    const newPet: PetDTO = {
      id: 'pet-uuid',
      name: 'Stringy',
      species: 'Dog',
      breed: 'Hotweiller',
      age: 2,
      tutorId: 'tutor-uuid',
    };

    expect(petService.create(newPet)).rejects.toThrow(ConflictException);
    expect(petRepositoryMock.save).not.toHaveBeenCalled();
  });
});
