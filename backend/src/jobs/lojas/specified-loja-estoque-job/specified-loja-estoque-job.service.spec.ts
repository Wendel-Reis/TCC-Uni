import { Test, TestingModule } from '@nestjs/testing';
import { SpecifiedLojaEstoqueJobService } from './specified-loja-estoque-job.service';

describe('SpecifiedLojaEstoqueJobService', () => {
  let service: SpecifiedLojaEstoqueJobService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpecifiedLojaEstoqueJobService],
    }).compile();

    service = module.get<SpecifiedLojaEstoqueJobService>(SpecifiedLojaEstoqueJobService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
