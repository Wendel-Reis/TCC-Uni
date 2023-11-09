import { TestBed } from '@angular/core/testing';

import { EventoAprovacaoService } from './evento-aprovacao.service';

describe('EventoAprovacaoService', () => {
  let service: EventoAprovacaoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventoAprovacaoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
