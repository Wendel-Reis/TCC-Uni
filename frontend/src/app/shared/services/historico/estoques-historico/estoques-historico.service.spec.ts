import { TestBed } from '@angular/core/testing';

import { EstoquesHistoricoService } from './estoques-historico.service';

describe('EstoquesHistoricoService', () => {
  let service: EstoquesHistoricoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstoquesHistoricoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
