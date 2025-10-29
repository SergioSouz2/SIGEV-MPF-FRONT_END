import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router'; // 1. Importar o Router
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {

  userName: string = 'Usuário';
  visitantesHoje: number = 0;
  visitantesAtivos: number = 0;
  totalDoMes: number = 0;

  isUserAdmin: boolean = false;

  // 2. Injetar o Router (além do AuthService que já estava)
  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {


  }

  carregarEstatisticas(): void {
    this.visitantesHoje = 12;
    this.visitantesAtivos = 5;
    this.totalDoMes = 245;
  }

  // 3. Adicionar o método logout()
  logout(): void {
    this.router.navigate(['/login']);
  }
}
