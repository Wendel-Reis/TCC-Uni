
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PageableDto, PageOptionsDto } from '../../../interfaces/others/pageable.dto';
import { PageUtils } from '../../../utils/PageUtils';
import { API_CONFIG } from '../../../../../config/api.config';

import { CreateSolicitacaoDto, PatchSolicitacaoComprovanteDto, SearchSolicitacaoDto, SolicitacaoDto } from './../../../interfaces/fluxo-pagamentos/solicitacoes/solicitacao.dto';
import { ArquivoGeralDto } from './../../../interfaces/arquivos/arquivo-geral.dto';

@Injectable({
  providedIn: 'root'
})
export class SolicitacaoService {


  constructor(
    private readonly http: HttpClient,
  ) { }


  findById(id: string): Observable<SolicitacaoDto> {
    return this.http.get<SolicitacaoDto>(`${API_CONFIG.baseURL}/solicitacoes/${id}`, {
      responseType: 'json',
    });
  }

  list(filterDto?: SearchSolicitacaoDto, pageOptions = new PageOptionsDto()): Observable<PageableDto<SolicitacaoDto>> {
    let params = PageUtils.getPageOptionsParams(pageOptions);

    if (filterDto) {
      if (filterDto.created_at) {
        params = params.append('created_at', filterDto.created_at.toDateString());
      }

      if (filterDto.max_custo) {
        params = params.append('max_custo', filterDto.max_custo);
      }

      if (filterDto.searchedSolicitacao) {
        params = params.append('searchedSolicitacao', filterDto.searchedSolicitacao);
      }

      if (filterDto.max_data_vencimento) {
        params = params.append('max_data_vencimento', filterDto.max_data_vencimento.toDateString());
      }

      if (filterDto.min_custo) {
        params = params.append('min_custo', filterDto.min_custo);
      }

      if (filterDto.min_data_vencimento) {
        params = params.append('min_data_vencimento', filterDto.min_data_vencimento.toDateString());
      }

      if (filterDto.operacao_id) {
        params = params.append('operacao_id', filterDto.operacao_id);
      }

      if (filterDto.searchedOperacao) {
        params = params.append('searchedOperacao', filterDto.searchedOperacao);
      }

      if (filterDto.searchedSolicitante) {
        params = params.append('searchedSolicitante', filterDto.searchedSolicitante);
      }

      if (filterDto.solicitante_id) {
        params = params.append('solicitante_id', filterDto.solicitante_id);
      }

      if (filterDto.status) {
        params = params.append('status', filterDto.status);
      }
    }

    return this.http.get<PageableDto<SolicitacaoDto>>(`${API_CONFIG.baseURL}/solicitacoes`, {
      responseType: 'json',
      params,
    });
  }

  create(dto: CreateSolicitacaoDto): Observable<SolicitacaoDto> {
    return this.http.post<SolicitacaoDto>(`${API_CONFIG.baseURL}/solicitacoes/`,
      dto,
      {
        responseType: 'json',
      });
  }

  createComprovante(anexo: File): Observable<ArquivoGeralDto> {
    const formData = new FormData();

    formData.append('file', anexo);

    return this.http.post<ArquivoGeralDto>(
      `${API_CONFIG.baseURL}/solicitacoes/anexos/comprovantes`,
      formData,
      {
        responseType: 'json',
      });
  }

  associarComprovante(id: string, dto: PatchSolicitacaoComprovanteDto): Observable<SolicitacaoDto> {
    return this.http.patch<SolicitacaoDto>(
      `${API_CONFIG.baseURL}/solicitacoes/${id}/anexar/comprovante`,
      dto,
      {
        responseType: 'json',
      });
  }

  createContaOriginal(anexo: File): Observable<ArquivoGeralDto> {
    const formData = new FormData();

    formData.append('file', anexo);

    return this.http.post<ArquivoGeralDto>(
      `${API_CONFIG.baseURL}/solicitacoes/anexos/contas`,
      formData,
      {
        responseType: 'json',
      });
  }

  /*
    associarContaOriginal(id: string, dto: PatchSolicitacaoComprovanteDto): Observable<SolicitacaoDto> {
      return this.http.patch<SolicitacaoDto>(
        `${API_CONFIG.baseURL}/solicitacoes/${id}/anexar/contas`,
        dto,
        {
          responseType: 'json',
        });
    }*/

  aprovarSolicitacao(id: string): Observable<SolicitacaoDto> {
    return this.http.patch<SolicitacaoDto>(
      `${API_CONFIG.baseURL}/solicitacoes/${id}/aprovar`,
      {
        responseType: 'json',
      });
  }

  rejeitarSolicitacao(id: string): Observable<SolicitacaoDto> {
    return this.http.patch<SolicitacaoDto>(
      `${API_CONFIG.baseURL}/solicitacoes/${id}/rejeitar`,
      {
        responseType: 'json',
      });
  }

  notificarAprovadores(id: string): Observable<any> {
    return this.http.put<any>(
      `${API_CONFIG.baseURL}/solicitacoes/${id}/notificar`,
      {
        responseType: 'json',
      });
  }

}
