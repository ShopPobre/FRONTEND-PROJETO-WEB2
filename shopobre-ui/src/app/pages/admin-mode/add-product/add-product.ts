import { Component } from '@angular/core';
import { ProductForm } from '../../../shared/components/product-form/product-form';
import { SideBar } from '../../../shared/components/side-bar/side-bar';

@Component({
  selector: 'app-add-product',
  imports: [ProductForm, SideBar],
  templateUrl: './add-product.html',
  styleUrl: './add-product.scss',
})
export class AddProduct {

}
