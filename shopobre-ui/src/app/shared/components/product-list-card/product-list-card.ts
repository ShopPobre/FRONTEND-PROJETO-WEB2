import { Component, computed, EventEmitter, input, Input, output, Output } from '@angular/core';
import { ProductResponseDTO } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-list-card',
  imports: [],
  templateUrl: './product-list-card.html',
  styleUrl: './product-list-card.scss',
})
export class ProductListCard {

  product = input.required<ProductResponseDTO>();
  editClick = output<number>();
  deleteClick = output<number>();

  readonly DEFAULT_IMAGE = 'https://placehold.co/100x100?text=No+Image';

  productImage = computed(() => {
    const p = this.product();
    return p.mainImage?.urlPath       
      ?? p.images?.[0]?.urlPath       
      ?? this.DEFAULT_IMAGE;          
  });

}
