import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-form-edit',
  imports: [],
  templateUrl: './form-edit.html',
  styleUrl: './form-edit.scss',
})
export class FormEdit {

  label = input<string | null>(null);
  type = input.required<string>();
  placeholder = input.required<string>();

}
