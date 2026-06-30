import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PetEntity } from 'src/db/entities/pet.entity';
import { PetDTO } from 'src/dtos/pet.dto';
import { TutorDTO } from 'src/dtos/tutor.dto';
import { PetService } from 'src/pet/pet.service';
import { TutorService } from 'src/tutor/tutor.service';
import { Repository } from 'typeorm';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('PetService', () => {
  let service: PetService;
  let repository: MockRepository<PetEntity>;

  const mockedPet: PetDTO = {
    id: 'generated-uuid',
    name: 'Stringy',
    species: 'Dog',
    breed: 'Hotweiller',
    age: 23,
    tutorId: 'tutor-uuid',
  };

  const mockedTutor: TutorDTO = {
    id: 'tutor-uuid',
    name: 'Mock Jackson',
    email: 'mock@create.com',
    age: 23,
    pets: [],
  };

  const mockPetRepository = () => ({
    findOne: jest.fn().mockResolvedValue(mockedPet),
    find: jest.fn().mockResolvedValue([mockedPet]),
    save: jest.fn().mockReturnValue(mockedPet),
    update: jest.fn().mockResolvedValue({
      affected: 1,
    }),
    delete: jest.fn().mockResolvedValue({
      affected: 1,
    }),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PetService,
        {
          provide: getRepositoryToken(PetEntity),
          useValue: mockPetRepository(),
        },
        {
          provide: TutorService,
          useValue: { findBy: jest.fn().mockResolvedValue(mockedTutor) },
        },
      ],
    }).compile();

    service = module.get<PetService>(PetService);
    repository = module.get(getRepositoryToken(PetEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a pet and return properties id and name', async () => {
      repository.find?.mockResolvedValue(null);

      const pet: PetDTO = {
        name: 'Stringy',
        species: 'Dog',
        breed: 'Hotweiller',
        age: 23,
        tutorId: 'tutor-uuid',
      };

      const result = await service.create(pet);

      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ id: mockedPet.id, name: mockedPet.name });
      expect(result).not.toBe(mockedPet);
    });
  });

  describe('findAll', () => {
    it('should return all pets', async () => {
      const result = await service.findAll();

      expect(result).toEqual([mockedPet]);
      expect(repository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findById', () => {
    it('should search a pet by id and return if found', async () => {
      const id = 'fake-id';

      const result = await service.findById(id);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id },
      });
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockedPet);
    });

    it('should throw a not found if pet doesnt exist', async () => {
      repository.findOne?.mockResolvedValue(null);

      const id = 'generated-id';

      expect(service.findById(id)).rejects.toThrow(NotFoundException);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id },
      });
      expect(repository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('findByTutor', () => {
    it('should return all pets from a tutor', async () => {
      const tutorId = 'tutor-uuid';
      const result = await service.findByTutor(tutorId);

      expect(result).toEqual([mockedPet]);
      expect(repository.find).toHaveBeenCalledTimes(1);
      expect(repository.find).toHaveBeenCalledWith({
        where: { tutorId },
      });
    });

    it('should return a not found exception if no pets are available', async () => {
      const tutorId = 'tutor-uuid';
      repository.find?.mockResolvedValue(null);
      expect(service.findByTutor(tutorId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a pet', async () => {
      const id = 'generated-uuid';
      const data = {
        name: 'Doggy',
      };

      const result = await service.update(id, data);

      expect(result).toEqual({
        id: id,
        ...data,
        tutorId: mockedPet.tutorId,
      });
      expect(repository.update).toHaveBeenCalledWith(id, data);
      expect(repository.update).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception if pet not found', async () => {
      const id = 'generated-uuid';
      const data = {
        name: 'Doggy',
      };

      repository.findOne?.mockResolvedValue(null);

      expect(service.update(id, data)).rejects.toThrow(NotFoundException);
    });

    it('should throw an exception if unable to update in database', async () => {
      const id = 'generated-uuid';
      const data = {
        name: 'Doggy',
      };

      repository.update?.mockResolvedValue({
        affected: undefined,
      });

      expect(service.update(id, data)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('delete', () => {
    it('should delete and return a pet from the database', async () => {
      const id = 'generated-uuid';

      const result = await service.delete(id);

      expect(result).toEqual(mockedPet);
      expect(repository.delete).toHaveBeenCalledWith(id);
      expect(repository.delete).toHaveBeenCalledTimes(1);
    });
  });
});
