import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CargaProdutosDto } from 'src/app/shared/interfaces/carga-dados/carga-produtos.dto';
import { API_CONFIG } from 'src/config/api.config';

@Injectable({
  providedIn: 'root'
})
export class ProdutosHistoricoService {

  constructor(
    private readonly http: HttpClient,
  ) { }

  findByCargaId(id: string): Observable<CargaProdutosDto[]> {
    return this.http.get<CargaProdutosDto[]>(`${API_CONFIG.baseURL}/produtos-historico/${id}`, {
      responseType: 'json',
    });
  }
}
