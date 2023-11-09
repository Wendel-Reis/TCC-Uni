import { Test, TestingModule } from '@nestjs/testing';
import { CargaDadosService } from './carga-dados.service';

describe('CargaDadosService', () => {
  let service: CargaDadosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CargaDadosService],
    }).compile();

    service = module.get<CargaDadosService>(CargaDadosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
