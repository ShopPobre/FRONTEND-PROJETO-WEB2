import { Component, EventEmitter, inject, input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-actions-footer',
  imports: [],
  templateUrl: './actions-footer.html',
  styleUrl: './actions-footer.scss',
})
export class ActionsFooter {

  label = input.required<string>();
  disabled = input<boolean>(false);
  @Output() btnClick = new EventEmitter<void>();
  @Output() saveChanges = new EventEmitter<void>();
  cancelRoute = input<string>('/');

  private router = inject(Router);

  onCancel() {
    this.router.navigate([this.cancelRoute()]);
  }


}
