import { Test, TestingModule } from '@nestjs/testing';
import { ProdutosHistoricoController } from './produtos-historico.controller';
import { ProdutosHistoricoService } from './produtos-historico.service';

describe('ProdutosHistoricoController', () => {
  let controller: ProdutosHistoricoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProdutosHistoricoController],
      providers: [ProdutosHistoricoService],
    }).compile();

    controller = module.get<ProdutosHistoricoController>(ProdutosHistoricoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
