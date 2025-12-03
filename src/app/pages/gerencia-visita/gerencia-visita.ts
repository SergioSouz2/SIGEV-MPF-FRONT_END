import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { VisitaService } from '../../services/visita.service';
import { DatePipe, NgIf, NgFor, CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { Visita } from '../../interfaces/visita.interface';

@Component({
  selector: 'app-gerenciar-visitas',
  templateUrl: './gerencia-visita.html',
  styleUrls: ['./gerencia-visita.css'],
  imports: [NgIf, NgFor, DatePipe, CommonModule, FormsModule]

})
export class VisitasComponent implements OnInit {

  userName: string = '';

  activeTab: 'ativos' | 'historico' = 'ativos';

  visitasAtivas: Visita[] = [];
  visitasHistorico: Visita[] = [];
  visitasHoje: number = 0;
  saidasHoje: number = 0;
  totalDoMes: number = 0;
  searchTerm: string = '';
  termoBusca: string = '';

  constructor(
    private visitaService: VisitaService,
    private authService: AuthService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.userName = localStorage.getItem('userName') || 'Usuário';
    this.carregarVisitas();
  }

  /* =====================================================
      CARREGAR VISITAS
  ====================================================== */
  carregarVisitas(): void {
    this.visitaService.getVisitas().subscribe({
      next: (data) => {
        this.visitasHistorico = data;

        this.calcularAtivos();
        this.calcularRegistrosHoje();
        this.calcularSaidasHoje();
        this.calcularTotalDoMes();
      },
      error: () => {
        console.error("Erro ao buscar visitas");
      }
    });
  }

  /* =====================================================
      ABAS
  ====================================================== */
  selecionarTab(tab: 'ativos' | 'historico') {
    this.activeTab = tab;
  }

  /* =====================================================
      BUSCA
  ====================================================== */
  atualizarBusca(event: any) {
    this.termoBusca = event.target.value.toLowerCase();
  }

  filtrar(lista: any[]) {
    return !this.termoBusca.trim()
      ? lista
      : lista.filter(v =>
        v.visitante?.nomeCompleto?.toLowerCase().includes(this.termoBusca) ||
        v.visitante?.documentoIdentidade?.toLowerCase().includes(this.termoBusca) ||
        v.localDestino?.toLowerCase().includes(this.termoBusca)
      );
  }

  /* =====================================================
      AÇÕES
  ====================================================== */
  registrarEntrada(id: string) {
    this.visitaService.registrarEntrada(id).subscribe({
      next: () => this.carregarVisitas()
    });
  }

 registrarSaida(id: string) {
  this.visitaService.registrarSaida(id).subscribe({
    next: () => {
      this.carregarVisitas();
      this.cd.detectChanges(); // <- força atualização da tela
    }
  });
}

  deletarVisita(id: string) {
    if (!confirm("Remover visita?")) return;

    this.visitaService.deletarVisita(id).subscribe({
      next: () => this.carregarVisitas()
    });
  }

  calcularAtivos(): void {
    this.visitasAtivas = this.visitasHistorico.filter(v => v.dataSaida === null);
  }


  calcularRegistrosHoje(): void {
    const hoje = new Date().toDateString();

    this.visitasHoje = this.visitasHistorico.filter(v =>
      v.dataEntrada && new Date(v.dataEntrada).toDateString() === hoje
    ).length;
  }



  calcularSaidasHoje(): void {
    const hoje = new Date().toDateString();

    this.saidasHoje = this.visitasHistorico.filter(v =>
      v.dataSaida && new Date(v.dataSaida).toDateString() === hoje
    ).length;
  }

  calcularTotalDoMes(): void {
    const hoje = new Date();
    const limite = new Date();
    limite.setDate(hoje.getDate() - 30);

    this.totalDoMes = this.visitasHistorico.filter(v => {
      if (!v.dataEntrada) return false;
      const data = new Date(v.dataEntrada);
      return data >= limite;
    }).length;
  }

  /* =====================================================
      NAVEGAÇÃO
  ====================================================== */
  voltadashboard() {
    this.router.navigate(['/dashboard']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
