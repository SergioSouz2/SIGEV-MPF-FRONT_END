import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class RegisterVisitorService {

  constructor(private http: HttpClient) {}

  registrarVisitante(data: any): Observable<any> {

    
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    

    return this.http.post(`${environment.apiUrl}/visitante`, data, { headers });
  }

 
}
