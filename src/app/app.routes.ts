import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { AdminPanelComponent } from './pages/painel-admin/painel-admin';
import { GerenciaVisita } from './pages/gerencia-visita/gerencia-visita';
import { RegisterVisita } from './pages/register-visita/register-visita';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'admin', component: AdminPanelComponent },
  { path: 'registar-visitas', component: RegisterVisita },
  { path: 'gerenciar-visitas', component: GerenciaVisita },

];
