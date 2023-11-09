import { Test, TestingModule } from '@nestjs/testing';
import { GenerateLojaEstoqueJobService } from './generate-loja-estoque-job.service';

describe('GenerateLojaEstoqueJobService', () => {
  let service: GenerateLojaEstoqueJobService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GenerateLojaEstoqueJobService],
    }).compile();

    service = module.get<GenerateLojaEstoqueJobService>(GenerateLojaEstoqueJobService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
