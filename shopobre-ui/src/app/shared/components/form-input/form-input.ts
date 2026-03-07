import { Component, input } from '@angular/core';

@Component({
  selector: 'app-form-input',
  imports: [],
  templateUrl: './form-input.html',
  styleUrl: './form-input.scss',
})
export class FormInput {
  type = input.required<string>();
  placeholder = input.required<string>();
  icon = input.required<string>();

}
