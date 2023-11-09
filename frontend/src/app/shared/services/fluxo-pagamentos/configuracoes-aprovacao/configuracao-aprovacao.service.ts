

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PageableDto, PageOptionsDto } from '../../../interfaces/others/pageable.dto';
import { PageUtils } from '../../../utils/PageUtils';
import { API_CONFIG } from '../../../../../config/api.config';
import { ConfiguracoesAprovacaoDto, CreateConfiguracoesAprovacaoDto } from './../../../interfaces/fluxo-pagamentos/configuracoes-aprovacao/configuracao-aprovacao.dto';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracaoAprovacaoService {

  constructor(
    private readonly http: HttpClient,
  ) { }

  findById(id: string): Observable<ConfiguracoesAprovacaoDto> {
    return this.http.get<ConfiguracoesAprovacaoDto>(`${API_CONFIG.baseURL}/configuracoes-aprovacao/${id}/current`, {
      responseType: 'json',
    });
  }

  create(dto: CreateConfiguracoesAprovacaoDto): Observable<ConfiguracoesAprovacaoDto> {
    return this.http.post<ConfiguracoesAprovacaoDto>(`${API_CONFIG.baseURL}/configuracoes-aprovacao/`,
      dto,
      {
        responseType: 'json',
      });
  }

}
