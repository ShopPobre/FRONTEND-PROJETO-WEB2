import { Injectable, signal, computed } from '@angular/core';
import { CartItem } from '../models/cart.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private items = signal<CartItem[]>([]);

  cartItems = this.items.asReadonly();
  count = computed(() => this.items().reduce((acc, i) => acc + i.quantity, 0));
  subtotal = computed(() =>
    this.items().reduce((acc, i) => acc + i.price * i.quantity, 0)
  );

  add(item: Omit<CartItem, 'quantity'> & { quantity?: number }): void {
    const qty = item.quantity ?? 1;
    this.items.update((list) => {
      const idx = list.findIndex((i) => i.productId === item.productId);
      if (idx >= 0) {
        const next = [...list];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + qty };
        return next;
      }
      return [
        ...list,
        {
          productId: item.productId,
          name: item.name,
          price: item.price,
          imageUrl: item.imageUrl,
          quantity: qty,
        },
      ];
    });
  }

  setQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.remove(productId);
      return;
    }
    this.items.update((list) =>
      list.map((i) =>
        i.productId === productId ? { ...i, quantity } : i
      )
    );
  }

  remove(productId: number): void {
    this.items.update((list) => list.filter((i) => i.productId !== productId));
  }

  getItem(productId: number): CartItem | undefined {
    return this.items().find((i) => i.productId === productId);
  }

  clear(): void {
    this.items.set([]);
  }
}
