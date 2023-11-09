import { Test, TestingModule } from '@nestjs/testing';
import { CargaProdutosJobService } from './carga-produtos-job.service';

describe('CargaProdutosJobService', () => {
  let service: CargaProdutosJobService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CargaProdutosJobService],
    }).compile();

    service = module.get<CargaProdutosJobService>(CargaProdutosJobService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
