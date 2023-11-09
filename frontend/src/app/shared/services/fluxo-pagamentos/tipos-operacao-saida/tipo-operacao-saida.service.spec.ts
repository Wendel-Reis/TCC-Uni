import { TestBed } from '@angular/core/testing';

import { TipoOperacaoSaidaService } from './tipo-operacao-saida.service';

describe('TipoOperacaoSaidaService', () => {
  let service: TipoOperacaoSaidaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoOperacaoSaidaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
