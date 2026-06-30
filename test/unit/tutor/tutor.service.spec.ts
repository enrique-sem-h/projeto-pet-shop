import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TutorEntity } from 'src/db/entities/tutor.entity';
import { TutorDTO } from 'src/dtos/tutor.dto';
import { TutorService } from 'src/tutor/tutor.service';
import { Repository } from 'typeorm';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('TutorService', () => {
  let service: TutorService;
  let repository: MockRepository<TutorEntity>;

  const mockedTutor: TutorDTO = {
    id: 'generated-uuid',
    name: 'Mock Jackson',
    email: 'mock@create.com',
    age: 23,
    pets: [],
  };

  const mockTutorRepository = () => ({
    findOne: jest.fn().mockResolvedValue(mockedTutor),
    find: jest.fn().mockResolvedValue([mockedTutor]),
    save: jest.fn().mockReturnValue(mockedTutor),
    update: jest.fn().mockResolvedValue({
      affected: 1,
    }),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TutorService,
        {
          provide: getRepositoryToken(TutorEntity),
          useValue: mockTutorRepository(),
        },
      ],
    }).compile();

    service = module.get<TutorService>(TutorService);
    repository = module.get(getRepositoryToken(TutorEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a tutor and return properties id and email', async () => {
      repository.findOne?.mockResolvedValue(null);

      const params: TutorDTO = {
        id: 'fake-id',
        name: 'Mock Jackson',
        email: 'mock@create.com',
        age: 23,
        pets: [],
      };

      const result = await service.create(params);

      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ id: mockedTutor.id, email: mockedTutor.email });
      expect(result).not.toBe(mockedTutor);
    });
  });

  describe('findAll', () => {
    it('should return all tutors', async () => {
      const result = await service.findAll();

      expect(result).toEqual([mockedTutor]);
      expect(repository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findBy', () => {
    it('should search a tutor by id and return if found', async () => {
      const id = {
        id: 'fake-id',
      };

      const result = await service.findBy(id);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: [id, { email: undefined }],
        relations: {
          pets: true,
        },
      });
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockedTutor);
    });

    it('should search a tutor by email and return if found', async () => {
      const email = {
        email: 'mock@email.com',
      };

      const result = await service.findBy(email);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: [{ id: undefined }, email],
        relations: {
          pets: true,
        },
      });
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockedTutor);
    });

    it('should throw a bad request if not called with parameters', async () => {
      expect(service.findBy({})).rejects.toThrow(BadRequestException);
    });

    it('should throw a not found if tutor not exists', async () => {
      repository.findOne?.mockResolvedValue(null);

      const id = {
        id: 'generated-id',
      };

      expect(service.findBy(id)).rejects.toThrow(NotFoundException);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: [id, { email: undefined }],
        relations: {
          pets: true,
        },
      });
      expect(repository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should update a tutor', async () => {
      const id = 'generated-uuid';
      const data = {
        email: 'new@email.com',
      };

      const result = await service.update(id, data);

      expect(result).toEqual({
        id: id,
        ...data,
      });
      expect(repository.update).toHaveBeenCalledWith(id, data);
      expect(repository.update).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception if tutor not found', async () => {
      const id = 'generated-uuid';
      const data = {
        email: 'new@email.com',
      };

      repository.findOne?.mockResolvedValue(null);

      expect(service.update(id, data)).rejects.toThrow(NotFoundException);
    });

    it('should throw an exception if unable to update in database', async () => {
      const id = 'generated-uuid';
      const data = {
        email: 'new@email.com',
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
    it('should delete and return a user from the database', async () => {
      const id = 'generated-uuid';

      const result = await service.delete(id);

      expect(result).toEqual(mockedTutor);
      expect(repository.delete).toHaveBeenCalledWith(id);
      expect(repository.delete).toHaveBeenCalledTimes(1);
    });
  });
});
