import { Component } from '@angular/core';
import { Header } from '../../shared/components/header/header';
import { AddressForm } from '../../shared/components/address-form/address-form';

@Component({
  selector: 'app-address',
  imports: [Header, AddressForm],
  templateUrl: './address.html',
  styleUrl: './address.scss',
})
export class Address {

}
