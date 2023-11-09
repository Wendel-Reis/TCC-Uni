import { EventoAprovacaoDto, SearchSolicitacaoEventoDto } from './../../../interfaces/fluxo-pagamentos/eventos-aprovacao/evento-aprovacao.dto';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PageableDto, PageOptionsDto } from '../../../interfaces/others/pageable.dto';
import { PageUtils } from '../../../utils/PageUtils';
import { API_CONFIG } from '../../../../../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class EventoAprovacaoService {

  
  constructor(
    private readonly http: HttpClient,
  ) { }


  findById(id: string): Observable<EventoAprovacaoDto> {
    return this.http.get<EventoAprovacaoDto>(`${API_CONFIG.baseURL}/solicitacao-eventos/${id}`, {
      responseType: 'json',
    });
  }

  list(filterDto?: SearchSolicitacaoEventoDto, pageOptions = new PageOptionsDto()): Observable<PageableDto<EventoAprovacaoDto>> {
    let params = PageUtils.getPageOptionsParams(pageOptions);

    if (filterDto) {
      if (filterDto.acao) {
        params = params.append('acao', filterDto.acao);
      }

      if (filterDto.aprovadorSearched) {
        params = params.append('aprovadorSearched', filterDto.aprovadorSearched);
      }

      if (filterDto.aprovador_id) {
        params = params.append('aprovador_id', filterDto.aprovador_id);
      }

      if (filterDto.data_evento) {
        params = params.append('data_evento', filterDto.data_evento.toDateString());
      }

      if (filterDto.solicitacao_id) {
        params = params.append('solicitacao_id', filterDto.solicitacao_id);
      }
    }

    return this.http.get<PageableDto<EventoAprovacaoDto>>(`${API_CONFIG.baseURL}/solicitacao-eventos`, {
      responseType: 'json',
      params,
    });
  }


}
