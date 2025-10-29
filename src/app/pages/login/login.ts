// ARQUIVO: src/app/pages/login/login.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
// O caminho deve estar correto agora

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  email: string = '';
  senha: string = '';

  onSubmit(): void {
    console.log('Dados do formulário:', {
      email: this.email,
      senha: this.senha
    });
  }
}
