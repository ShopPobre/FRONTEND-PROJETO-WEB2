import { Component, input, OnInit, output } from '@angular/core';
import { OrderResponseDTO } from '../../../core/models/order.model';


@Component({
  selector: 'app-order-list-card',
  imports: [],
  templateUrl: './order-list-card.html',
  styleUrl: './order-list-card.scss',
})
export class OrderListCard  {


  order = input.required<OrderResponseDTO>();
  editClick = output<number>();
  deleteClick = output<number>();

}
