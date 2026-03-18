import { Component, input, output, signal } from '@angular/core';
import { InventoryResponseDTO } from '../../../core/models/inventory.model';
import { ProductResponseDTO } from '../../../core/models/product.model';
import { ProductService } from '../../../core/services/product.service';
import { InventoryService } from '../../../core/services/inventory.service';
import { SwalService } from '../../../core/services/swal.service';

@Component({
  selector: 'app-inventory-list-card',
  imports: [],
  templateUrl: './inventory-list-card.html',
  styleUrl: './inventory-list-card.scss',
})
export class InventoryListCard {
  inventory = input.required<InventoryResponseDTO>();
  editClick = output<number>();
  deleteClick = output<number>();
  product = signal<ProductResponseDTO | undefined>(undefined);
  quantity = signal<number>(0);

  constructor(
    private readonly productService: ProductService,
    private readonly inventoryService: InventoryService,
    private readonly swalService: SwalService,
  ) {}

  ngOnInit() {
    this.loadProduct();
    this.quantity.set(this.inventory().quantity);
  }

  loadProduct() {
    this.productService.getProductById(String(this.inventory().productId)).subscribe((p) => {
      if (p) {
        this.product.set(p);
      }
    });
  }

  updateQuantity(delta: number) {
    if (delta < 0 && this.quantity() === 0) {
      this.swalService.error('Quantidade não pode ser menor que zero!');
      return;
    }

    const productId = this.inventory().productId;
    const data = { quantity: 1 };

    const request$ =
      delta > 0
        ? this.inventoryService.increase(productId, data)
        : this.inventoryService.decrease(productId, data);

    request$.subscribe({
      next: () => {
        this.quantity.update((q) => q + delta);
        this.swalService.success(
          delta > 0 ? 'Quantidade incrementada!' : 'Quantidade decrementada!',
        );
      },
      error: (err) => {
        const mensagem = err.error?.error || err.error?.message || 'Erro ao atualizar quantidade';
        this.swalService.error(mensagem);
      },
    });
  }
}
