import { Test, TestingModule } from '@nestjs/testing';
import { TutorController } from '../../../src/tutor/tutor.controller';
import { TutorService } from 'src/tutor/tutor.service';
import { TutorDTO } from 'src/dtos/tutor.dto';

describe('TutorController', () => {
  let controller: TutorController;
  let service: TutorService;

  const tutorMock: TutorDTO = {
    id: 'generated-id',
    age: 16,
    email: 'mocked@tutor.com',
    name: 'Mock Jackson',
    pets: [],
  };

  const updatedTutorMock: TutorDTO = {
    id: 'generated-id',
    age: 16,
    email: 'new@email.com',
    name: 'Mock Jackson',
    pets: [],
  };

  const mockService = {
    create: jest.fn().mockImplementation(async (dto) => ({
      id: 'generated-id',
      ...dto,
      pets: [],
    })),
    findAll: jest.fn().mockResolvedValue([tutorMock]),
    findBy: jest.fn().mockResolvedValue(tutorMock),
    update: jest.fn().mockResolvedValue(updatedTutorMock),
    delete: jest.fn().mockResolvedValue(tutorMock),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TutorController],
      providers: [
        {
          provide: TutorService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<TutorController>(TutorController);
    service = module.get<TutorService>(TutorService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should call service to create and return a new tutor', async () => {
      const dto: TutorDTO = {
        name: 'Mock Jackson',
        email: 'mocked@tutor.com',
        age: 16,
      };

      const result = await controller.create(dto);

      expect(service.create).toBeDefined();
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(service.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(tutorMock);
    });
  });

  describe('read', () => {
    it('should call service to find all users', async () => {
      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(service.findAll).toHaveReturned();
      expect(result).toEqual(expect.any(Array));
    });
    it('should call service to find users by id', async () => {
      await controller.findById('generated-id');

      expect(service.findBy).toHaveBeenCalledTimes(1);
      expect(service.findBy).toHaveBeenCalledWith({ id: 'generated-id' });
      expect(service.findBy).resolves.toBe(tutorMock);
    });
  });

  describe('update', () => {
    it('should call service to update data for tutor', async () => {
      const dto = {
        email: 'new@email.com',
      };
      const result = await controller.update('generated-id', dto);

      expect(service.update).toHaveBeenCalledTimes(1);
      expect(service.update).toHaveBeenCalledWith('generated-id', dto);
      expect(result).toEqual(updatedTutorMock);
    });
  });

  describe('delete', () => {
    it('should call service to delete tutor', async () => {
      const result = await controller.delete('generated-id');

      expect(service.delete).toHaveBeenCalledTimes(1);
      expect(service.delete).toHaveBeenCalledWith('generated-id');
      expect(service.delete).resolves.toBe(tutorMock);
    });
  });
});
