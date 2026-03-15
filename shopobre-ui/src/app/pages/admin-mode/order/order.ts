import { Component, inject } from '@angular/core';
import { SideBar } from '../../../shared/components/side-bar/side-bar';
import { Router } from '@angular/router';
import { TopNavBar } from '../../../shared/components/top-nav-bar/top-nav-bar';
import { ControlActions } from '../../../shared/components/control-actions/control-actions';
import { OrderList } from '../../../shared/components/order-list/order-list';

@Component({
  selector: 'app-order',
  imports: [SideBar, TopNavBar, ControlActions, OrderList],
  templateUrl: './order.html',
  styleUrl: './order.scss',
})
export class Order {

  private router = inject(Router);

   navegarEdit(orderId: number) {
    this.router.navigate(['admin/orders/edit', orderId]);
  }

}
