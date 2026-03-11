import { Component, EventEmitter, input, Output } from '@angular/core';
import { FormEdit } from '../form-edit/form-edit';
import { ActionsFooter } from "../actions-footer/actions-footer";

@Component({
  selector: 'app-product-form',
  imports: [FormEdit, ActionsFooter],
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss',
})
export class ProductForm {

  label = input.required<string>();
  @Output() btnClick = new EventEmitter<void>();

}
