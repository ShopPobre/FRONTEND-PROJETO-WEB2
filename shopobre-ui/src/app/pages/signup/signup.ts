import { Component, inject, signal } from '@angular/core';
import { User } from '../../core/models/user.model';
import { DefaultLoginSignupLayout } from '../../shared/components/default-login-signup-layout/default-login-signup-layout';
import { SignupForm } from '../../shared/components/signup-form/signup-form';
import { Router } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import Swal from 'sweetalert2';
import { SwalService } from '../../core/services/swal.service';

@Component({
  selector: 'app-signup',
  imports: [DefaultLoginSignupLayout, SignupForm],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class Signup {
  userData = signal<User>({
    name: '',
    email: '',
    password: '',
    cpf: '',
    telefone: '',
  });

  constructor(
    private readonly userService: UserService,
    private readonly router: Router,
    private readonly swalService: SwalService
  ) {}

  navegar() {
    this.router.navigate(['login']);
  }

  signup() {
    this.userService.signup(this.userData()).subscribe({
      next: (response) => {
        this.swalService.success('Registro realizado com sucesso!');
        this.router.navigate(['login']);
      },

      error: (err) => {
        const mensagemErro = err.error?.error || err.error?.message || 'Erro no servidor';
        this.swalService.error(mensagemErro);
      },
    });
  }
}
