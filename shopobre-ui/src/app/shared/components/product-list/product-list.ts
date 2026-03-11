import { Component } from '@angular/core';
import { ProductListCard } from '../product-list-card/product-list-card';
import { ProductDetailView } from '../../../core/models/product.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-list',
  imports: [ProductListCard, CommonModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList {
  products: ProductDetailView[] = [
    {
      id: 1,
      name: 'Product 1',
      createdAt: 'Mon, Aug 21, 2025',
      isActive: true,
      price: 50,
      categoryId: 0,
      images: [],
    },
    {
      id: 2,
      name: 'Product 2',
      createdAt: 'Mon, Aug 21, 2025',
      isActive: false,
      price: 50,
      categoryId: 0,
      images: [],
    },
  ];
}
