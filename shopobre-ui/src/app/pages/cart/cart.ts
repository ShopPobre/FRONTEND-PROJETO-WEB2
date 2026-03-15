import { Component, inject, computed, signal } from '@angular/core';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Header } from '../../shared/components/header/header';
import { Breadcrumb } from '../../shared/components/breadcrumb/breadcrumb';
import { BreadcrumbItem } from '../../shared/components/breadcrumb/breadcrumb';
import { CartService } from '../../core/services/cart.service';
import { CartItem } from '../../core/models/cart.model';

@Component({
  selector: 'app-cart',
  imports: [Header, Breadcrumb, CurrencyPipe, DecimalPipe, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class Cart {
  private cart = inject(CartService);

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

  proceedToCheckout(): void {
    // Implementar depois
  }
}
