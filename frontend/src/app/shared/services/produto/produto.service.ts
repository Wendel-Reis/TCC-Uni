import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PageableDto, PageOptionsDto } from '../../interfaces/others/pageable.dto';
import { PageUtils } from '../../utils/PageUtils';
import { API_CONFIG } from '../../../../config/api.config';
import { CreateProdutoDto, ProdutoDto, SearchProdutoDto, UpdateProdutoDto } from '../../interfaces/produtos/produto.dto';
import { ArquivoGeralDto } from '../../interfaces/arquivos/arquivo-geral.dto';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  constructor(
    private readonly http: HttpClient,
  ) { }

  list(filterDto?: SearchProdutoDto, pageOptions = new PageOptionsDto()): Observable<PageableDto<ProdutoDto>> {
    let params = PageUtils.getPageOptionsParams(pageOptions);

    if (filterDto && filterDto.nome) {
      params = params.append('nome', filterDto.nome);
    }

    if (filterDto && filterDto.descricao) {
      params = params.append('descricao', filterDto.descricao);
    }

    if (filterDto && filterDto.searchedProduto) {
      params = params.append('searchedProduto', filterDto.searchedProduto);
    }

    return this.http.get<PageableDto<ProdutoDto>>(`${API_CONFIG.baseURL}/produtos`, {
      responseType: 'json',
      params,
    });
  }

  findById(id: string): Observable<ProdutoDto> {
    return this.http.get<ProdutoDto>(`${API_CONFIG.baseURL}/produtos/${id}`, {
      responseType: 'json',
    });
  }

  create(dto: CreateProdutoDto): Observable<any> {
    return this.http.post<any>(
      `${API_CONFIG.baseURL}/produtos`,
      dto,
      {
        responseType: 'json',
      });
  }

  update(produto_id: string, dto: UpdateProdutoDto): Observable<ProdutoDto> {
    return this.http.put<ProdutoDto>(
      `${API_CONFIG.baseURL}/produtos/${produto_id}`,
      dto,
      {
        responseType: 'json',
      });
  }


  createImagemPrincipal(anexo: File): Observable<ArquivoGeralDto> {
    const formData = new FormData();

    formData.append('file', anexo);

    return this.http.post<ArquivoGeralDto>(
      `${API_CONFIG.baseURL}/produtos/imagens/principal`,
      formData,
      {
        responseType: 'json',
      });
  }

}
