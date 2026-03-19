import { Component, EventEmitter, OnInit, computed, input, output, Output, signal } from '@angular/core';
import { ProductListCard } from '../product-list-card/product-list-card';
import { ProductResponseDTO } from '../../../core/models/product.model';
import { CommonModule } from '@angular/common';
import { TableHeader } from '../table-header/table-header';
import { ProductService } from '../../../core/services/product.service';
import Swal from 'sweetalert2';
import { SwalService } from '../../../core/services/swal.service';

@Component({
  selector: 'app-product-list',
  imports: [ProductListCard, CommonModule, TableHeader],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList implements OnInit {
  private readonly allProducts = signal<ProductResponseDTO[]>([]);
  readonly searchTerm = input<string>('');

  readonly products = computed(() => {
    const q = this.normalizeText(this.searchTerm());
    const list = this.allProducts();
    if (!q) return list;

    return list.filter((p) => {
      const name = this.normalizeText(p.name);
      const desc = this.normalizeText(p.description ?? '');
      return name.includes(q) || desc.includes(q);
    });
  });

  isLoading = signal(false);
  editClick = output<number>();

  constructor(
    private readonly productService: ProductService,
    private readonly swalService: SwalService,
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  private normalizeText(input: string): string {
    return (input ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ' ');
  }

  private loadProducts() {
    this.isLoading.set(true);
    this.productService.getProducts().subscribe({
      next: (response: any) => {
        this.allProducts.set(response.data ?? response ?? []);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      },
    });
  }

  deleteProduct(productId: number) {
    Swal.fire({
      title: 'Tem certeza?',
      text: 'Essa ação não pode ser desfeita!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.deleteProduct(String(productId)).subscribe({
          next: () => {
            this.swalService.success('Produto excluído!');
            this.allProducts.update((list) => list.filter((p) => p.id !== productId));
          },
          error: (err) => {
            const mensagem = err.error?.error || err.error?.message || 'Erro ao excluir produto';
            this.swalService.error(mensagem);
          },
        });
      }
    });
  }
}
