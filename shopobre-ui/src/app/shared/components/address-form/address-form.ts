import { Component } from '@angular/core';
import { FormEdit } from '../form-edit/form-edit';
import { ActionsFooter } from "../actions-footer/actions-footer";

@Component({
  selector: 'app-address-form',
  imports: [FormEdit, ActionsFooter],
  templateUrl: './address-form.html',
  styleUrl: './address-form.scss',
})
export class AddressForm {

}
