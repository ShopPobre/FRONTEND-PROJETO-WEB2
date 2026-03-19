import { Component, computed, input, signal } from '@angular/core';
import { FormEdit } from '../form-edit/form-edit';
import { ActionsFooter } from '../actions-footer/actions-footer';
import { User } from '../../../core/models/user.model';
import { UserService } from '../../../core/services/user.service';
import { SwalService } from '../../../core/services/swal.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-form',
  imports: [FormEdit, ActionsFooter],
  templateUrl: './account-form.html',
  styleUrl: './account-form.scss',
})
export class AccountForm {

  navegar = input<string>('/home');

  private original = signal<User | null>(null);

  name = signal('');
  email = signal('');
  cpf = signal('');
  telefone = signal('');

  currentPassword = signal('');
  newPassword = signal('');
  confirmPassword = signal('');

  isDirty = computed(() => {
    const o = this.original();
    if (!o) return false;

    return (
      this.name() !== o.name ||
      this.email() !== o.email ||
      this.cpf() !== o.cpf ||
      this.telefone() !== o.telefone ||
      this.currentPassword() !== '' ||
      this.newPassword() !== '' ||
      this.confirmPassword() !== ''
    );
  });

  constructor(
    private readonly userService: UserService,
    private readonly swalService: SwalService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadProfile();
  }

  private loadProfile() {
    this.userService.getUser().subscribe({
      next: (data: any) => {
        this.name.set(data.name);
        this.email.set(data.email);
        this.cpf.set(data.cpf);
        this.telefone.set(data.telefone);
        this.original.set({ ...data, password: '' });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  saveChanges() {
    const payload: Partial<User> = {
      name: this.name(),
      email: this.email(),
      cpf: this.cpf(),
      telefone: this.telefone(),
      ...(this.newPassword() && {
        password: this.newPassword(),
      }),
    };

    const request$ = this.userService.updateUser(payload);

    request$.subscribe({
      next: () => {
        this.swalService.success('Usuario atualizado!');
       
        const updatedOriginal = {
          ...(this.original() ?? {}),
          name: this.name(),
          email: this.email(),
          cpf: this.cpf(),
          telefone: this.telefone(),
          password: '', 
        } as User;
        this.original.set(updatedOriginal);
        this.router.navigate(['home']);
      },
      error: (err) => {
        const mensagem = err.error?.error || err.error?.message || 'Erro ao salvar endereço';
        this.swalService.error(mensagem);
      },
    });
  }
}
