import { TestBed } from '@angular/core/testing';

import { ProdutosHistoricoService } from './produtos-historico.service';

describe('ProdutosHistoricoService', () => {
  let service: ProdutosHistoricoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProdutosHistoricoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
