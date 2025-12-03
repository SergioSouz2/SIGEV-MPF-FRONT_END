import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterVisitorService } from '../../services/visitante.service';
import { VisitaService } from '../../services/visita.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-register-visitor',
    standalone: true,
    templateUrl: './register-visita.html',
    styleUrls: ['./register-visita.css'],
    imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class RegisterVisitorComponent {

    etapa = 1;
    visitanteId: string | null = null;
    searchTerm: string = '';
    formVisitante: FormGroup;
    formVisita: FormGroup;
    userId = '';
    userName = "Usuário";


    constructor(
        private fb: FormBuilder,
        private visitanteService: RegisterVisitorService,
        private visitaService: VisitaService,
        private router: Router
    ) {
        this.userName = localStorage.getItem('userName') || 'Usuário';
        this.userId = localStorage.getItem('userId') || '';
        this.formVisitante = this.fb.group({
            nomeCompleto: ['', Validators.required],
            documentoIdentidade: ['', Validators.required],
            cpf: ['', Validators.required],
            sexo: ['', Validators.required],
            dataNascimento: ['', Validators.required],
            telefone: [''],
            email: [''],
            foto: [null]
        });

        this.formVisita = this.fb.group({
            pessoaVisitada: ['', Validators.required],
            departamento: [''],
            motivo: ['', Validators.required],
            observacoes: ['']
        });
    }

    logout() {
        this.router.navigate(['/login']);
    }

    voltadashboard() {
        this.router.navigate(['/dashboard']);
    }

    onFileSelected(event: any) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            this.formVisitante.patchValue({ foto: reader.result });
        };
        reader.readAsDataURL(file);
    }

    registrarVisitante() {
        if (this.formVisitante.invalid) {
            this.formVisitante.markAllAsTouched();
            Swal.fire({
                icon: 'warning',
                title: 'Atenção!',
                text: 'Preencha todos os campos obrigatórios.'
            });
            return;
        }

        const raw = this.formVisitante.value;

        const cpfNorm = this.normalizeCPF(raw.cpf);
        if (!this.isValidCPF(cpfNorm)) {
            Swal.fire({
                icon: 'error',
                title: 'CPF inválido!',
                text: 'Por favor, verifique o CPF informado.'
            });
            return;
        }

        const payload = {
            nomeCompleto: raw.nomeCompleto,
            cpf: cpfNorm,
            telefone: raw.telefone,
            sexo: raw.sexo,
            documentoIdentidade: raw.documentoIdentidade,
            dataNascimento: raw.dataNascimento,
            foto: raw.foto
        };


        this.visitanteService.registrarVisitante(payload).subscribe({
            next: (res) => {
                this.visitanteId = res.id;
                this.etapa = 2;

                Swal.fire({
                    icon: 'success',
                    title: 'Visitante registrado!',
                    text: 'Prossiga para registrar a visita.'
                });
            },
            error: () => {
                Swal.fire({
                    icon: 'error',
                    title: 'Erro!',
                    text: 'Erro ao registrar visitante.'
                });
            }
        });
    }

    private normalizeCPF(cpf: string): string {
        return (cpf || '').toString().replace(/\D/g, '');
    }




    private isValidCPF(cpf: string): boolean {
        cpf = this.normalizeCPF(cpf);
        if (!cpf || cpf.length !== 11) return false;
        if (/^(\d)\1{10}$/.test(cpf)) return false;

        const calc = (digits: string) => {
            let sum = 0;
            for (let i = 0; i < digits.length; i++) {
                sum += parseInt(digits.charAt(i), 10) * (digits.length + 1 - i);
            }
            const mod = sum % 11;
            return mod < 2 ? 0 : 11 - mod;
        };

        const base = cpf.substring(0, 9);
        const d1 = calc(base);
        const d2 = calc(base + d1);
        return cpf === base + d1.toString() + d2.toString();
    }

    registrarVisita() {
        if (!this.visitanteId) {
            Swal.fire({
                icon: 'info',
                title: 'Atenção!',
                text: 'Crie um visitante antes de registrar uma visita.'
            });
            return;
        }

        if (this.formVisita.invalid) {
            this.formVisita.markAllAsTouched();
            Swal.fire({
                icon: 'warning',
                title: 'Campos obrigatórios!',
                text: 'Preencha os campos da visita.'
            });
            return;
        }

        const payload = {
            idVisitante: this.visitanteId,
            registradoPor: this.userId,
            ...this.formVisita.value
        };

        console.log(payload);
        

        this.visitaService.registrarVisita(payload).subscribe({
            next: (res) => {

                const visitaId = res.id; // 👈 PEGANDO O ID DA VISITA

                // 🔥 Registrar a ENTRADA automaticamente
                this.visitaService.registrarEntrada(visitaId).subscribe(() => {

                    Swal.fire({
                        icon: 'success',
                        title: 'Visita registrada!',
                        text: 'A entrada foi registrada automaticamente.'
                    }).then(() => {

                        // Resetar para novo cadastro
                        this.formVisitante.reset();
                        this.formVisita.reset();
                        this.visitanteId = null;
                        this.etapa = 1;
                    });

                });

            },
            error: () => {
                Swal.fire({
                    icon: 'error',
                    title: 'Erro!',
                    text: 'Erro ao registrar visita.'
                });
            }
        });
    }

    filtrar(lista: any[]) {
        if (!this.searchTerm.trim()) return lista;

        const termo = this.searchTerm.toLowerCase();

        return lista.filter(v =>
            (v.visitanteNome || '').toLowerCase().includes(termo) ||
            (v.documentoIdentidade || '').toLowerCase().includes(termo) ||
            (v.localDestino || '').toLowerCase().includes(termo)
        );
    }


    voltar() {
        if (this.etapa > 1) this.etapa--;
    }
}
