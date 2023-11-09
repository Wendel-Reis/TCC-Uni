import { Test, TestingModule } from '@nestjs/testing';
import { CargaDadosController } from './carga-dados.controller';
import { CargaDadosService } from './carga-dados.service';

describe('CargaDadosController', () => {
  let controller: CargaDadosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CargaDadosController],
      providers: [CargaDadosService],
    }).compile();

    controller = module.get<CargaDadosController>(CargaDadosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
