import { Component, Input } from '@angular/core';
import { ProductDetailView } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-list-card',
  imports: [],
  templateUrl: './product-list-card.html',
  styleUrl: './product-list-card.scss',
})
export class ProductListCard {

  @Input() product!: ProductDetailView;

}
