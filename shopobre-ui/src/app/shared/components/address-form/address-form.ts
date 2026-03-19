import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormEdit } from '../form-edit/form-edit';
import { ActionsFooter } from '../actions-footer/actions-footer';
import { Address, AddressResponse } from '../../../core/models/address.model';
import { AddressService } from '../../../core/services/address.service';
import { SwalService } from '../../../core/services/swal.service';
import { catchError, of } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-address-form',
  imports: [FormEdit, ActionsFooter],
  templateUrl: './address-form.html',
  styleUrl: './address-form.scss',
})
export class AddressForm implements OnInit {
  private addressService = inject(AddressService);
  private swalService = inject(SwalService);

  private original = signal<Address | null>(null);
  private addressId = signal<string | null>(null);

  rua = signal('');
  numero = signal(0);
  cep = signal('');
  cidade = signal('');
  estado = signal('');
  tipo = signal('');

  hasAddress = computed(() => this.original() !== null);
  saveLabel = computed(() => (this.hasAddress() ? 'Atualizar Endereço' : 'Cadastrar Endereço'));

  isDirty = computed(() => {
    const o = this.original();
    if (!o) {
      return (
        this.rua() !== '' ||
        this.numero() !== 0 ||
        this.cep() !== '' ||
        this.cidade() !== '' ||
        this.estado() !== '' ||
        this.tipo() !== ''
      );
    }

    return (
      this.rua() !== o.rua ||
      this.numero() !== o.numero ||
      this.cep() !== o.cep ||
      this.cidade() !== o.cidade ||
      this.estado() !== o.estado ||
      this.tipo() !== o.tipo
    );
  });

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadAddress();
  }

  private loadAddress() {
    this.addressService
      .getAddress()
      .pipe(
        catchError((err) => {
          if (err.status === 404) return of(null);
          throw err;
        }),
      )
      .subscribe({
        next: (response: any) => {
          const data: AddressResponse = response?.data?.[0];

          if (data) {
            this.addressId.set(data.id);
            this.rua.set(data.rua);
            this.numero.set(data.numero);
            this.cep.set(data.cep);
            this.cidade.set(data.cidade);
            this.estado.set(data.estado);
            this.tipo.set(data.tipo);
            this.original.set({ ...data });
          }
        },
        error: (err) => console.error(err),
      });
  }

  saveAddress() {
    const payload: Address = {
      rua: this.rua(),
      numero: this.numero(),
      cep: this.cep(),
      cidade: this.cidade(),
      estado: this.estado(),
      tipo: this.tipo() as Address['tipo'],
    };

    const isUpdate = this.hasAddress();

    const request$ = isUpdate
      ? this.addressService.updateAddress(this.addressId()!, payload)
      : this.addressService.createAddress(payload);

    request$.subscribe({
      next: () => {
        this.swalService.success(isUpdate ? 'Endereço atualizado!' : 'Endereço cadastrado!');
        this.original.set({ ...payload });
        this.router.navigate(['home']);
      },
      error: (err) => {
        const mensagem = err.error?.error || err.error?.message || 'Erro ao salvar endereço';
        this.swalService.error(mensagem);
      },
    });
  }
}
