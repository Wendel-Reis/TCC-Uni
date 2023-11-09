import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CargaEstoquesDto } from 'src/app/shared/interfaces/carga-dados/carga-estoques.dto';
import { API_CONFIG } from 'src/config/api.config';

@Injectable({
  providedIn: 'root'
})
export class EstoquesHistoricoService {

  constructor(
    private readonly http: HttpClient,
  ) { }

  findByCargaId(id: string): Observable<CargaEstoquesDto[]> {
    return this.http.get<CargaEstoquesDto[]>(`${API_CONFIG.baseURL}/estoques-historico/${id}`, {
      responseType: 'json',
    });
  }
}
