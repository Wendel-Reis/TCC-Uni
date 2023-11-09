import { TestBed } from '@angular/core/testing';

import { ConfiguracaoAprovacaoService } from './configuracao-aprovacao.service';

describe('ConfiguracaoAprovacaoService', () => {
  let service: ConfiguracaoAprovacaoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfiguracaoAprovacaoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
