import { TestBed } from '@angular/core/testing';

import { NivelAprovacaoService } from './nivel-aprovacao.service';

describe('NivelAprovacaoService', () => {
  let service: NivelAprovacaoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NivelAprovacaoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
