import { Component, EventEmitter, OnInit, output, Output, signal } from '@angular/core';
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
  products = signal<ProductResponseDTO[]>([]);
  isLoading = signal(false);
  editClick = output<number>();

  constructor(
    private readonly productService: ProductService,
    private readonly swalService: SwalService,
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  private loadProducts() {
    this.productService.getProducts().subscribe({
      next: (response: any) => {
        this.products.set(response.data ?? response);
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
            this.products.update((list) => list.filter((p) => p.id !== productId));
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
