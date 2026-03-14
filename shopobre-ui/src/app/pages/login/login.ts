import { Component, inject, signal } from '@angular/core';
import { DefaultLoginSignupLayout } from '../../shared/components/default-login-signup-layout/default-login-signup-layout';
import { LoginForm } from '../../shared/components/login-form/login-form';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LoginRequest } from '../../core/models/auth.model';
import Swal from 'sweetalert2';
import { SwalService } from '../../core/services/swal.service';

@Component({
  selector: 'app-login',
  imports: [DefaultLoginSignupLayout, LoginForm],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  authData = signal<LoginRequest>({
    email: '',
    password: '',
  });

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly swalService: SwalService
  ) {}

  navegar() {
    this.router.navigate(['signup']);
  }

  login() {
    this.authService.login(this.authData()).subscribe({
      next: (response: any) => {
        this.authService.setToken(response.accessToken);
        const role = this.authService.getUserRole();

        this.swalService.success('Login realizado com sucesso!');

        if (role === 'ADMIN') {
          this.router.navigate(['admin/products']);
        } else {
          this.router.navigate(['home']);
        }
      },

      error: (err) => {
        const mensagemErro = err.error?.error || err.error?.message || 'Erro no servidor';
        this.swalService.error(mensagemErro);
      },
    });
  }
}
