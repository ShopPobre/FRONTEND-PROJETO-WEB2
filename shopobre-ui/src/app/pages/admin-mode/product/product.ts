import { Component, inject, signal } from '@angular/core';
import { SideBar } from '../../../shared/components/side-bar/side-bar';
import { TopNavBar } from '../../../shared/components/top-nav-bar/top-nav-bar';
import { ControlActions } from '../../../shared/components/control-actions/control-actions';
import { ProductList } from '../../../shared/components/product-list/product-list';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product',
  imports: [SideBar, TopNavBar, ControlActions, ProductList],
  templateUrl: './product.html',
  styleUrl: './product.scss',
})
export class Product {
  private router = inject(Router);
  readonly searchTerm = signal('');

  navegar() {
    this.router.navigate(['admin/products/add']);
  }

  navegarEdit(productId: number) {
    this.router.navigate(['admin/products/edit', productId]);
  }

  onSearchChange(value: string): void {
    this.searchTerm.set(value ?? '');
  }
}
