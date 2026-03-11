import { Component, EventEmitter, input, Output } from '@angular/core';
import { Button } from "../button/button";

@Component({
  selector: 'app-control-actions',
  imports: [Button],
  templateUrl: './control-actions.html',
  styleUrl: './control-actions.scss',
})
export class ControlActions {

  label = input.required<string>();

  @Output() btnClick = new EventEmitter<void>();

}
