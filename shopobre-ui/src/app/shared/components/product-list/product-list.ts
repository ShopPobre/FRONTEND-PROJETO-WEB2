import { Component, OnInit, signal } from '@angular/core';
import { ProductListCard } from '../product-list-card/product-list-card';
import { ProductResponseDTO } from '../../../core/models/product.model';
import { CommonModule } from '@angular/common';
import { TableHeader } from '../table-header/table-header';
import { ProductService } from '../../../core/services/product.service';

@Component({
  selector: 'app-product-list',
  imports: [ProductListCard, CommonModule, TableHeader],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList implements OnInit {

  products = signal<ProductResponseDTO[]>([]);
  isLoading = signal(false);


  constructor(
    private readonly productService: ProductService
  ){}


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
}
