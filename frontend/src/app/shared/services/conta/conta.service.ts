import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_CONFIG } from 'src/config/api.config';
//import { ContaDTO } from '../../interfaces/contas/ContaDTO';

@Injectable({
  providedIn: 'root'
})
export class ContaService {

  constructor(
    private http: HttpClient,
  ) { }
/*
  doCalculationById(id: string): Observable<any> {
    return this.http.patch<any>(`${API_CONFIG.baseURL}/conta/${id}`, null);
  }

  findByUserAndDate(user_id: string, data: Date): Observable<ContaDTO> {
    const params = new HttpParams()
      .set('data', data.toDateString());

    return this.http.get<ContaDTO>(`${API_CONFIG.baseURL}/conta/${user_id}`, { params });
  }*/
}
