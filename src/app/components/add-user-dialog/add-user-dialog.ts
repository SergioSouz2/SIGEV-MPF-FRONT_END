import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './add-user-dialog.html',
  styleUrls: ['./add-user-dialog.css'],
})
export class UserDialogComponent {
  userForm: FormGroup;
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Partial<User>
  ) {
    this.userForm = this.fb.group({
      id: [data?.id || null],
      name: [data?.name || '', Validators.required],
      cpf: [data?.cpf || '', Validators.required],
      documento_identidade: [data?.documento_identidade || ''],
      sexo: [data?.sexo || ''],
      data_nascimento: [data?.data_nascimento || null],
      telefone: [data?.telefone || ''],
      email: [data?.email || '', [Validators.required, Validators.email]],
      login: [data?.login || '', Validators.required],
      password: [data?.password || '', Validators.required],
      role: [data?.role || 'USER', Validators.required],
      created_at: [data?.created_at || new Date()],
      updated_at: [data?.updated_at || new Date()],
    });
  }

  salvar() {
    if (this.userForm.invalid) {
      Swal.fire({
        title: 'Atenção!',
        text: 'Por favor, preencha todos os campos obrigatórios.',
        icon: 'warning',
        confirmButtonText: 'Fechar'
      });
      return;
    }

    this.isSaving = true;
    const userData = this.userForm.value;

    const request$ = userData.id
      ? this.userService.update(userData.id, userData)
      : this.userService.create(userData);

    request$.subscribe({
      next: (user) => {
        this.isSaving = false;
        Swal.fire({
          title: '✅ Sucesso!',
          text: 'Usuário salvo com sucesso!',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
        this.dialogRef.close(user);
      },
      error: (err) => {
        this.isSaving = false;

        // 🔥 Captura a mensagem do backend se existir
        let message = 'Erro ao salvar usuário.';
        if (err?.error) {
          if (typeof err.error === 'string') {
            message = err.error; // Ex: "Erro: Email já está em uso!"
          } else if (err.error?.message) {
            message = err.error.message;
          }
        }

        Swal.fire({
          title: 'Erro!',
          text: message,
          icon: 'error',
          confirmButtonText: 'Fechar'
        });

        console.error('Erro ao salvar usuário:', err);
      }
    });
  }

  cancelar() {
    this.dialogRef.close();
  }
}
