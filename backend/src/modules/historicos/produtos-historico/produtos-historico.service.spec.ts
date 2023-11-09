import { Test, TestingModule } from '@nestjs/testing';
import { ProdutosHistoricoService } from './produtos-historico.service';

describe('ProdutosHistoricoService', () => {
  let service: ProdutosHistoricoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProdutosHistoricoService],
    }).compile();

    service = module.get<ProdutosHistoricoService>(ProdutosHistoricoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
