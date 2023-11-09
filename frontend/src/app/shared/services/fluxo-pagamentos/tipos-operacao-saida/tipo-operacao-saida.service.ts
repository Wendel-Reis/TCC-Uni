
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PageableDto, PageOptionsDto } from '../../../interfaces/others/pageable.dto';
import { PageUtils } from '../../../utils/PageUtils';
import { API_CONFIG } from '../../../../../config/api.config';
import { SearchTipoOperacoesSaidaDto, TipoOperacaoSaidaDto } from './../../../interfaces/fluxo-pagamentos/tipos-operacao-saida/tipo-operacao-saida.dto';

@Injectable({
  providedIn: 'root'
})
export class TipoOperacaoSaidaService {

  constructor(
    private readonly http: HttpClient,
  ) { }

  list(filterDto?: SearchTipoOperacoesSaidaDto, pageOptions = new PageOptionsDto())
    : Observable<PageableDto<TipoOperacaoSaidaDto>> {
    let params = PageUtils.getPageOptionsParams(pageOptions);

    if (filterDto) {
      if (filterDto.descricao) {
        params = params.append('descricao', filterDto.descricao);
      }

      if (filterDto.nome) {
        params = params.append('nome', filterDto.nome);
      }

      if (filterDto.searchedTipoOperacao) {
        params = params.append('searchedTipoOperacao', filterDto.searchedTipoOperacao);
      }
    }

    return this.http.get<PageableDto<TipoOperacaoSaidaDto>>(`${API_CONFIG.baseURL}/tipo-operacoes-saida`, {
      responseType: 'json',
      params,
    });
  }

  findById(id: string): Observable<TipoOperacaoSaidaDto> {
    return this.http.get<TipoOperacaoSaidaDto>(`${API_CONFIG.baseURL}/tipo-operacoes-saida/${id}`, {
      responseType: 'json',
    });
  }
}
