import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductForm } from '../../../shared/components/product-form/product-form';
import { SideBar } from '../../../shared/components/side-bar/side-bar';

@Component({
  selector: 'app-edit-product',
  imports: [SideBar, ProductForm],
  templateUrl: './edit-product.html',
  styleUrl: './edit-product.scss',
})
export class EditProduct implements OnInit {
  private route = inject(ActivatedRoute);

  productId = signal<number | null>(null);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.productId.set(id ? Number(id) : null);
  }
}