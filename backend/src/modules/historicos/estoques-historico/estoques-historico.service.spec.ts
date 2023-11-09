import { Test, TestingModule } from '@nestjs/testing';
import { EstoquesHistoricoService } from './estoques-historico.service';

describe('EstoquesHistoricoService', () => {
  let service: EstoquesHistoricoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EstoquesHistoricoService],
    }).compile();

    service = module.get<EstoquesHistoricoService>(EstoquesHistoricoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
