import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { LoginCredentials, AuthResponse } from '../interfaces/auth.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    console.log('Ambiente:', environment.production ? 'Produção' : 'Desenvolvimento');
    console.log('URL da API:', environment.apiUrl);

    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    return this.http.post<AuthResponse>(
      `${environment.apiUrl}/auth/login`,
      credentials,
      {
        headers,
        withCredentials: true // Adiciona credenciais à requisição
      }
    ).pipe(
      tap(response => {
        // Salva o token no localStorage
        localStorage.setItem('token', response.token);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
