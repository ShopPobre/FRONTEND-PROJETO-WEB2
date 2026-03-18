import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Header } from '../../shared/components/header/header';
import { Footer } from '../../shared/components/footer/footer';
import { OrderService } from '../../core/services/order.service';
import { OrderDetailResponseDTO } from '../../core/models/order.model';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, Header, Footer, RouterLink],
  templateUrl: './order-detail.html',
  styleUrl: './order-detail.scss',
})
export class OrderDetailPage {
  private route = inject(ActivatedRoute);
  private orderService = inject(OrderService);

  order: OrderDetailResponseDTO | null = null;
  loading = true;
  error: string | null = null;

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id || Number.isNaN(id)) {
      this.error = 'Pedido inválido.';
      this.loading = false;
      return;
    }

    this.orderService.getOrderDetailsById(id).subscribe({
      next: (order) => {
        this.order = order;
        this.loading = false;
      },
      error: (err) => {
        this.error =
          err.error?.error ||
          err.error?.message ||
          'Não foi possível carregar os dados do pedido.';
        this.loading = false;
      },
    });
  }
}

