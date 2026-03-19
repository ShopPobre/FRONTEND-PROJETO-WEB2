import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Header } from '../../shared/components/header/header';
import { Footer } from '../../shared/components/footer/footer';
import { OrderService } from '../../core/services/order.service';
import { OrderResponseDTO } from '../../core/models/order.model';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, Header, Footer, RouterLink],
  templateUrl: './orders.html',
  styleUrl: './orders.scss',
})
export class OrdersPage {
  private orderService = inject(OrderService);

  orders: OrderResponseDTO[] = [];
  loading = true;
  error: string | null = null;
  page = 1;
  limit = 10;
  totalPages = 1;
  total = 0;

  ngOnInit() {
    this.loadPage(1);
  }

  loadPage(page: number) {
    if (page < 1 || (this.totalPages && page > this.totalPages)) return;
    this.loading = true;
    this.error = null;
    this.orderService.getOrdersByCurrentUser(page, this.limit).subscribe({
      next: (response) => {
        this.orders = response.data;
        this.page = response.pagination.page;
        this.limit = response.pagination.limit;
        this.total = response.pagination.total;
        this.totalPages = response.pagination.totalPages;
        this.loading = false;
      },
      error: (err) => {
        this.error =
          err.error?.error ||
          err.error?.message ||
          'Não foi possível carregar seus pedidos.';
        this.loading = false;
      },
    });
  }

  goToPrevious() {
    this.loadPage(this.page - 1);
  }

  goToNext() {
    this.loadPage(this.page + 1);
  }
}

