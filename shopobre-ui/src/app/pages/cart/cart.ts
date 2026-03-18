import { Component, inject, computed, signal } from '@angular/core';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Header } from '../../shared/components/header/header';
import { Footer } from '../../shared/components/footer/footer';
import { Breadcrumb } from '../../shared/components/breadcrumb/breadcrumb';
import { BreadcrumbItem } from '../../shared/components/breadcrumb/breadcrumb';
import { CartService } from '../../core/services/cart.service';
import { CartItem } from '../../core/models/cart.model';
import { OrderService } from '../../core/services/order.service';
import { PaymentService } from '../../core/services/payment.service';
import { SwalService } from '../../core/services/swal.service';
import { AuthService } from '../../core/services/auth.service';
import { AddressService } from '../../core/services/address.service';
import { CheckoutDataService } from '../../core/services/checkout-data.service';
import { AddressResponse } from '../../core/models/address.model';

@Component({
  selector: 'app-cart',
  imports: [Header, Footer, Breadcrumb, CurrencyPipe, DecimalPipe, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class Cart {
  private cart = inject(CartService);
  private orderService = inject(OrderService);
  private paymentService = inject(PaymentService);
  private swalService = inject(SwalService);
  private router = inject(Router);
  private authService = inject(AuthService);
  private addressService = inject(AddressService);
  private checkoutData = inject(CheckoutDataService);

  pendingRemove = signal<{ productId: number; previousQuantity: number } | null>(null);
  rowHoverId = signal<number | null>(null);

  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', link: '/home' },
    { label: 'Cart' },
  ];

  items = this.cart.cartItems;
  subtotal = this.cart.subtotal;
  count = this.cart.count;

  total = computed(() => this.cart.subtotal() + 0);

  addresses = signal<AddressResponse[]>([]);
  selectedAddressId = signal<string | null>(null);

  ngOnInit() {
    const role = this.authService.getUserRole();
    if (role === 'USER') {
      this.addressService.getAddress().subscribe({
        next: (data: any) => {
          const list = Array.isArray(data?.data)
            ? (data.data as AddressResponse[])
            : Array.isArray(data)
            ? (data as AddressResponse[])
            : [];
          this.addresses.set(list);
          if (list.length > 0) {
            this.selectedAddressId.set(list[0].id);
          }
        },
        error: () => {
          // Silencioso aqui; tratamos na hora do checkout se não houver endereço
        },
      });
    }
  }

  confirmRemove(productId: number, previousQuantity: number): void {
    this.pendingRemove.set({ productId, previousQuantity });
  }

  doRemove(): void {
    const p = this.pendingRemove();
    if (!p) return;
    this.cart.remove(p.productId);
    this.pendingRemove.set(null);
  }

  cancelRemove(): void {
    const p = this.pendingRemove();
    if (!p) return;
    this.cart.setQuantity(p.productId, p.previousQuantity);
    this.pendingRemove.set(null);
  }

  onQuantityChange(item: CartItem, newQty: number): void {
    if (newQty <= 0) {
      this.confirmRemove(item.productId, item.quantity);
      return;
    }
    this.cart.setQuantity(item.productId, newQty);
  }

  onDeleteClick(item: CartItem): void {
    this.confirmRemove(item.productId, item.quantity);
  }

  getSubtotal(item: CartItem): number {
    return item.price * item.quantity;
  }

  onAddressChange(id: string): void {
    this.selectedAddressId.set(id);
  }

  proceedToCheckout(): void {
    const role = this.authService.getUserRole();

    if (role !== 'USER') {
      this.swalService.error(
        'Apenas usuários do tipo CLIENTE podem realizar checkout. Faça login com uma conta de cliente.',
      );
      return;
    }

    const items = this.items();

    if (!items.length) {
      this.swalService.warning('Seu carrinho está vazio.');
      return;
    }

    const addressId = this.selectedAddressId();
    if (!addressId) {
      this.swalService.error(
        'Selecione um endereço de entrega antes de finalizar o checkout.',
      );
      return;
    }

    this.orderService.createOrderFromCart(items, addressId).subscribe({
      next: (order) => {
        this.paymentService.createPayment(order.id, 'CREDIT_CARD').subscribe({
          next: (payment) => {
            if (!payment.clientSecret) {
              this.swalService.error('Erro ao iniciar pagamento.');
              return;
            }
            this.checkoutData.setPaymentData({
              clientSecret: payment.clientSecret,
              orderTotal: order.total,
              orderId: order.id,
            });
            this.router.navigate(['/checkout', 'payment', order.id], {
              state: {
                clientSecret: payment.clientSecret,
                orderTotal: order.total,
              },
            });
          },
          error: (err) => {
            const mensagem =
              err.error?.error ||
              err.error?.message ||
              'Erro ao criar pagamento';
            this.swalService.error(mensagem);
          },
        });
      },
      error: (err) => {
        const mensagem =
          err.error?.error ||
          err.error?.message ||
          'Erro ao criar pedido. Verifique se há endereço cadastrado.';
        this.swalService.error(mensagem);
      },
    });
  }
}
