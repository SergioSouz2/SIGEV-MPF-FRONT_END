import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './painel-admin.html',
  styleUrls: ['./painel-admin.css']
})
export class AdminPanelComponent implements OnInit {

  userName: string = 'Usuário';
  isUserAdmin: boolean = false;

  totalUsuarios = 0;
  totalAdmins = 0;
  totalRecepcionistas = 0;
  usuariosAtivos = 0;

  users: User[] = [];

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.userName = this.authService.getUserName();
    this.isUserAdmin = this.authService.getUserRole() === 'ADMIN';

    if (!this.isUserAdmin) {
      this.router.navigate(['/dashboard']);
      return;
    }

    this.carregarUsuarios();
  }

  carregarUsuarios(): void {
    this.userService.getAll().subscribe({
      next: (usuarios) => {
        this.users = usuarios;
        this.updateStats();
      },
      error: (err) => {
        console.error('Erro ao carregar usuários:', err);
      }
    });
  }



  deleteUser(user: User): void {
    Swal.fire({
      title: 'Atenção!',
      text: `Deseja realmente deletar ${user.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, deletar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.delete(user.id!).subscribe({
          next: () => {
            this.users = this.users.filter(u => u.id !== user.id);
            this.updateStats();
            Swal.fire('Deletado!', `${user.name} foi removido.`, 'success');
          },
          error: err => Swal.fire('Erro!', 'Não foi possível deletar o usuário.', 'error')
        });
      }
    });
  }

  // Novo método para atualizar estatísticas
  private updateStats(): void {
    this.totalUsuarios = this.users.length;
    this.totalAdmins = this.users.filter(u => u.role === 'ADMIN').length;
    this.totalRecepcionistas = this.users.filter(u => u.role === 'RECEPCIONISTA').length;
    this.usuariosAtivos = this.users.filter(u => u.role !== '').length; // Ajuste se tiver campo "ativo"
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
