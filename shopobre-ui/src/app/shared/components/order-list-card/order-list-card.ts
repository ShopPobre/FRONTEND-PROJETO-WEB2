import { Component, input, OnInit, output } from '@angular/core';
import { OrderResponseDTO, OrderStatus } from '../../../core/models/order.model';

@Component({
  selector: 'app-order-list-card',
  imports: [],
  templateUrl: './order-list-card.html',
  styleUrl: './order-list-card.scss',
})
export class OrderListCard {
  order = input.required<OrderResponseDTO>();
  deleteClick = output<number>();

  statusChanged = output<{ id: number; status: OrderStatus }>();

  onStatusChange(event: Event) {
    const status = (event.target as HTMLSelectElement).value as OrderStatus;
    this.statusChanged.emit({ id: this.order().id, status });
  }
}
