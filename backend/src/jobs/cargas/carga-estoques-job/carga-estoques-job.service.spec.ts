import { Test, TestingModule } from '@nestjs/testing';
import { CargaEstoquesJobService } from './carga-estoques-job.service';

describe('CargaEstoquesJobService', () => {
  let service: CargaEstoquesJobService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CargaEstoquesJobService],
    }).compile();

    service = module.get<CargaEstoquesJobService>(CargaEstoquesJobService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
