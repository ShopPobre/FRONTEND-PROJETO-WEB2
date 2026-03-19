import { Component, EventEmitter, input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class Button {

  label = input.required<string>();
  @Output() btnClick = new EventEmitter<void>();

}
