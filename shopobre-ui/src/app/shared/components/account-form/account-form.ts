import { Component } from '@angular/core';
import { FormEdit } from '../form-edit/form-edit';
import { ActionsFooter } from "../actions-footer/actions-footer";

@Component({
  selector: 'app-account-form',
  imports: [FormEdit, ActionsFooter],
  templateUrl: './account-form.html',
  styleUrl: './account-form.scss',
})
export class AccountForm {

}
