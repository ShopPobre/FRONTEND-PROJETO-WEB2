import { Component, EventEmitter, input, Output } from '@angular/core';

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

  @Output() valueChange = new EventEmitter<string>();

  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.valueChange.emit(value);
  }
}
