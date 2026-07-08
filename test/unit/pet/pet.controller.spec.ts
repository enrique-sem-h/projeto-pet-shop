import { Test, TestingModule } from '@nestjs/testing';
import { PetController } from '../../../src/pet/pet.controller';
import { PetService } from 'src/pet/pet.service';

describe('PetController', () => {
  let controller: PetController;
  let service: PetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PetController],
      providers: [
        {
          provide: PetService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<PetController>(PetController);
    service = module.get<PetService>(PetService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
