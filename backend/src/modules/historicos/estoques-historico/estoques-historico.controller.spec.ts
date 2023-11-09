import { Test, TestingModule } from '@nestjs/testing';
import { EstoquesHistoricoController } from './estoques-historico.controller';
import { EstoquesHistoricoService } from './estoques-historico.service';

describe('EstoquesHistoricoController', () => {
  let controller: EstoquesHistoricoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EstoquesHistoricoController],
      providers: [EstoquesHistoricoService],
    }).compile();

    controller = module.get<EstoquesHistoricoController>(EstoquesHistoricoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
