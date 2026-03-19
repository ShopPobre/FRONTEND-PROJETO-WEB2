import { Component, OnInit, output, signal } from '@angular/core';
import { OrderResponseDTO, OrderStatus } from '../../../core/models/order.model';
import { TableHeader } from '../table-header/table-header';
import { OrderService } from '../../../core/services/order.service';
import { SwalService } from '../../../core/services/swal.service';
import { OrderListCard } from '../order-list-card/order-list-card';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-order-list',
  imports: [TableHeader, OrderListCard],
  templateUrl: './order-list.html',
  styleUrl: './order-list.scss',
})
export class OrderList implements OnInit {
  delteClick = output<number>();
  orders = signal<OrderResponseDTO[]>([]);
  isLoading = signal(false);

  constructor(
    private readonly orderService: OrderService,
    private readonly swalService: SwalService,
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  private loadOrders() {
    this.orderService.getAllOrders().subscribe({
      next: (response: any) => {
        this.orders.set(response.data ?? response);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      },
    });
  }

  onStatusChanged(event: { id: number; status: OrderStatus }) {
    this.orderService.updateOrder(event.id, { status: event.status }).subscribe({
      next: () => {
        this.swalService.success('Status atualizado com sucesso!');
        this.loadOrders();
      },
      error: (err: any) => {
        console.error(err);
        this.swalService.error('Erro ao atualizar status.');
      },
    });
  }

  onDelete(id: number) {
    Swal.fire({
      title: 'Deletar pedido',
      text: 'Tem certeza que deseja deletar este pedido?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, deletar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d63384',
      cancelButtonColor: '#4a154b',
    }).then((result) => {
      if (!result.isConfirmed) return;

      this.orderService.deleteOrder(id).subscribe({
        next: () => {
          this.swalService.success('Pedido deletado com sucesso!');
          this.orders.update((orders) => orders.filter((o) => o.id !== id));
        },
        error: (err: any) => {
          console.error(err);
          this.swalService.error('Erro ao deletar pedido.');
        },
      });
    });
  }
}
