import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_CONFIG } from '../../../../config/api.config';
import { PageableDto, PageOptionsDto } from '../../interfaces/others/pageable.dto';
import { CreatePedidoDto, PedidoDto, SearchPedidoDto } from '../../interfaces/pedidos/pedido.dto';
import { PageUtils } from '../../utils/PageUtils';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  constructor(
    private http: HttpClient,
  ) { }

  create(dto: CreatePedidoDto, prv = false) {
    const url = prv ? `${API_CONFIG.baseURL}/pedidos/pdv` : `${API_CONFIG.baseURL}/pedidos`;
    return this.http.post<any>(
      url,
      dto,
      {
        responseType: 'json',
      });
  }

  list(filterDto?: SearchPedidoDto, pageOptions = new PageOptionsDto()): Observable<PageableDto<PedidoDto>> {
    let params = PageUtils.getPageOptionsParams(pageOptions);

    if (filterDto) {

      if (filterDto.acrescimo_desconto) {
        params = params.append('acrescimo_desconto', filterDto.acrescimo_desconto);
      }

      if (filterDto.cliente_id) {
        params = params.append('cliente_id', filterDto.cliente_id);
      }

      if (filterDto.local) {
        params = params.append('local', filterDto.local);
      }

      if (filterDto.loja_id) {
        params = params.append('loja_id', filterDto.loja_id);
      }

      if (filterDto.pagamento_forma) {
        params = params.append('pagamento_forma', filterDto.pagamento_forma);
      }

      if (filterDto.status_pedido) {
        params = params.append('status_pedido', filterDto.status_pedido);
      }

      if (filterDto.vendedor_id) {
        params = params.append('vendedor_id', filterDto.vendedor_id);
      }

      if (filterDto.searchedCliente) {
        params = params.append('searchedCliente', filterDto.searchedCliente);
      }

      if (filterDto.searchedLoja) {
        params = params.append('searchedLoja', filterDto.searchedLoja);
      }

      if (filterDto.searchedVendedor) {
        params = params.append('searchedVendedor', filterDto.searchedVendedor);
      }

      if (filterDto.searchedPedido) {
        params = params.append('searchedPedido', filterDto.searchedPedido);
      }

      if (filterDto.min_total) {
        params = params.append('min_total', filterDto.min_total);
      }

      if (filterDto.max_total) {
        params = params.append('max_total', filterDto.max_total);
      }

      if (filterDto.created_at) {
        params = params.append('created_at', filterDto.created_at.toString());
      }
    }

    return this.http.get<PageableDto<PedidoDto>>(`${API_CONFIG.baseURL}/pedidos`, {
      responseType: 'json',
      params,
    });
  }

  findById(id: string): Observable<PedidoDto> {
    return this.http.get<PedidoDto>(`${API_CONFIG.baseURL}/pedidos/${id}`, {
      responseType: 'json',
    });
  }
}
