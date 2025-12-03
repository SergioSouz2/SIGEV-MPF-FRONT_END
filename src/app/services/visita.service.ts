import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Visita } from '../interfaces/visita.interface';

@Injectable({
  providedIn: 'root'
})
export class VisitaService {

  private readonly baseUrl = `${environment.apiUrl}/visitas`;

  constructor(private http: HttpClient) { }

  /* =====================================================
      HELPERS
  ====================================================== */

  private authHeaders() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      })
    };
  }


  /* =====================================================
      LISTAR TODAS AS VISITAS
  ====================================================== */

  getVisitas(): Observable<Visita[]> {
    return this.http.get<Visita[]>(`${this.baseUrl}`, this.authHeaders());
  }


  /* =====================================================
      BUSCAR UMA VISITA ESPECÍFICA
  ====================================================== */

  getVisitaById(id: string): Observable<Visita> {
    return this.http.get<Visita>(`${this.baseUrl}/${id}`, this.authHeaders());
  }


  /* =====================================================
      CADASTRAR   (POST /visitas)
  ====================================================== */

  registrarVisita(body: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, body, this.authHeaders());
  }


  /* =====================================================
      REGISTRAR ENTRADA   (PATCH /visitas/{id}/entrada)
  ====================================================== */

  registrarEntrada(id: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}/entrada`, {}, this.authHeaders());
  }


  /* =====================================================
      REGISTRAR SAÍDA   (PATCH /visitas/{id}/saida)
  ====================================================== */

  registrarSaida(id: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}/saida`, {}, this.authHeaders());
  }


  /* =====================================================
      REMOVER VISITA   (DELETE /visitas/{id})
  ====================================================== */

  deletarVisita(id: string | number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, this.authHeaders());
  }

}
