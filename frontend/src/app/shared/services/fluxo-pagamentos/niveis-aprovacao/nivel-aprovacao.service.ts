import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_CONFIG } from '../../../../../config/api.config';
import { NivelAprovacaoDto } from './../../../interfaces/fluxo-pagamentos/niveis-aprovacao/nivel-aprovacao.dto';

@Injectable({
  providedIn: 'root'
})
export class NivelAprovacaoService {

  constructor(
    private readonly http: HttpClient,
  ) { }

  findById(id: string): Observable<NivelAprovacaoDto> {
    return this.http.get<NivelAprovacaoDto>(`${API_CONFIG.baseURL}/niveis-aprovacao/${id}`, {
      responseType: 'json',
    });
  }

  listByConfiguracaoId(id: string): Observable<NivelAprovacaoDto[]> {
    return this.http.get<NivelAprovacaoDto[]>(`${API_CONFIG.baseURL}/niveis-aprovacao/configuracao/${id}`, {
      responseType: 'json',
    });
  }
}
