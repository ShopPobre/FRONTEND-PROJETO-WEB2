import { Component, inject } from '@angular/core';
import { ProductForm } from '../../../shared/components/product-form/product-form';
import { SideBar } from '../../../shared/components/side-bar/side-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-product',
  imports: [ProductForm, SideBar],
  templateUrl: './add-product.html',
  styleUrl: './add-product.scss',
})
export class AddProduct {

  private router = inject(Router);


  navegar() {
    this.router.navigate(['admin/product']);
  }

}
