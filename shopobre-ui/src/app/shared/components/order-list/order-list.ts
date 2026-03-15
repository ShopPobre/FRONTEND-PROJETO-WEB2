import { Component, output, signal } from '@angular/core';
import { OrderResponseDTO } from '../../../core/models/order.model';
import { TableHeader } from '../table-header/table-header';

@Component({
  selector: 'app-order-list',
  imports: [TableHeader],
  templateUrl: './order-list.html',
  styleUrl: './order-list.scss',
})
export class OrderList {

  editClick = output<number>();
  orders = signal<OrderResponseDTO[]>([]);
  isLoading = signal(false);

}
