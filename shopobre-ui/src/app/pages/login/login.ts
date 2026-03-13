import { Component, inject, signal } from '@angular/core';
import { DefaultLoginSignupLayout } from '../../shared/components/default-login-signup-layout/default-login-signup-layout';
import { LoginForm } from '../../shared/components/login-form/login-form';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LoginRequest } from '../../core/models/auth.model';
import Swal from 'sweetalert2';

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
  ) {}

  navegar() {
    this.router.navigate(['signup']);
  }

  login() {
    this.authService.login(this.authData()).subscribe({
      next: (response) => {
        console.log('Login realizado', response);

        Swal.fire({
          toast: true,
          position: 'bottom-end',
          icon: 'success',
          title: 'Login realizado com sucesso!',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });

        this.router.navigate(['home']);
      },

      error: (err) => {
        console.log(err);

        Swal.fire({
          toast: true,
          position: 'bottom-end',
          icon: 'error',
          title: err.error?.message || 'Erro no servidor',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      },
    });
  }
}
