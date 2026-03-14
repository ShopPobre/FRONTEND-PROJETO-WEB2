import { Component, inject, input, signal, computed } from '@angular/core';
import { FormEdit } from '../form-edit/form-edit';
import { ActionsFooter } from '../actions-footer/actions-footer';
import { ProductService } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/category.service';
import { SwalService } from '../../../core/services/swal.service';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-product-form',
  imports: [FormEdit, ActionsFooter],
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss',
})
export class ProductForm {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private swalService = inject(SwalService);
  private router = inject(Router);

  navegar = input<string>('/admin/products');
  label = input<string>('Criar Produto');

  name = signal('');
  description = signal('');
  categoryName = signal(''); 
  price = signal('');

  isDirty = computed(() => this.name() !== '' && this.price() !== '' && this.categoryName() !== '');

  saveProduct() {
    this.categoryService
      .findOrCreate(this.categoryName())
      .pipe(
        switchMap((category) => {
          const payload = {
            name: this.name(),
            description: this.description(),
            categoryId: category.id,
            price: Number(this.price()),
          };

          return this.productService.createProduct(payload);
        }),
      )
      .subscribe({
        next: () => {
          this.swalService.success('Produto criado!');
          this.router.navigate([this.navegar()]);
        },
        error: (err) => {
          const mensagem = err.error?.error || err.error?.message || 'Erro ao criar produto';
          this.swalService.error(mensagem);
        },
      });
  }
}
