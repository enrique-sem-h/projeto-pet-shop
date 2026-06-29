import { Test, TestingModule } from '@nestjs/testing';
import { TutorController } from '../../../src/tutor/tutor.controller';
import { TutorService } from 'src/tutor/tutor.service';
import { TutorEntity } from 'src/db/entities/tutor.entity';
import { TutorDTO } from 'src/dtos/tutor.dto';

describe('TutorController', () => {
  let controller: TutorController;
  let service: TutorService;

  const mockedTutor: TutorDTO = {
    id: 'uashc-ds-csaw',
    age: 16,
    email: 'mocked@tutor.com',
    name: 'Mock Jackson',
    pets: [],
  };

  const mockService = {
    create: jest.fn().mockResolvedValue(mockedTutor),
    findAll: jest.fn().mockResolvedValue([mockedTutor]),
    findBy: jest.fn().mockResolvedValue([mockedTutor]),
    update: jest.fn().mockResolvedValue(mockedTutor),
    delete: jest.fn().mockResolvedValue(mockedTutor),
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
    it('should create and return a new tutor', async () => {
      const dto: TutorDTO = { name: 'Enrique', email: 'e2@email.com', age: 1 };

      const result = await controller.create(dto);

      console.log(result);
      console.log(dto);
      

      expect(result).toEqual(mockedTutor);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(service.create).toHaveBeenCalledTimes(1);
    });
  });
});
