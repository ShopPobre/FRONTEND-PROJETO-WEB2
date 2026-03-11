import { Component, EventEmitter, input, Output } from '@angular/core';

@Component({
  selector: 'app-actions-footer',
  imports: [],
  templateUrl: './actions-footer.html',
  styleUrl: './actions-footer.scss',
})
export class ActionsFooter {

  label = input.required<string>();
  @Output() btnClick = new EventEmitter<void>();

}
