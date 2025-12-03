import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { VisitaService } from '../../services/visita.service';
import { Visita } from '../../interfaces/visita.interface';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  userName: string = 'Usuário';

  visitantesHoje: number = 0;
  visitantesAtivos: number = 0;
  totalDoMes: number = 0;

  isUserAdmin: boolean = false;

  private subs: Subscription = new Subscription();

  constructor(
    private router: Router,
    private authService: AuthService,
    private visitaService: VisitaService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.userName = localStorage.getItem('userName') || 'Usuário';

    const role = this.authService.getUserRole();
    this.isUserAdmin = role ? role.toUpperCase() === 'ADMIN' : false;

    this.iniciarMonitoramentoEmTempoReal();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

iniciarMonitoramentoEmTempoReal(): void {
  const sub = this.visitaService.getVisitas().subscribe({
    next: (visitas: Visita[]) => {

      const hojeStr = new Date().toDateString();

      this.visitantesHoje = visitas.filter(v =>
        v.dataEntrada && new Date(v.dataEntrada).toDateString() === hojeStr
      ).length;

      this.visitantesAtivos = visitas.filter(v => v.dataSaida == null).length;

      this.calcularTotalUltimos30Dias(visitas);

      this.cdr.detectChanges();
    },
    error: (e) => console.error("Erro ao carregar visitas", e)
  });

  this.subs.add(sub);
}


  calcularTotalMes(listaHistorico: Visita[]): void {

    const hoje = new Date();
    const dataLimite = new Date();
    dataLimite.setDate(hoje.getDate() - 30);

    const visitasNoPeriodo = listaHistorico.filter(v => {
      if (!v.dataEntrada) return false;
      const dataEntrada = new Date(v.dataEntrada);
      return dataEntrada >= dataLimite;
    });

    this.totalDoMes = visitasNoPeriodo.length;
  }

  private calcularTotalUltimos30Dias(historico: Visita[]): void {
    this.calcularTotalMes(historico);
  }

  logout(): void {
    this.authService.logout();
  }
}
