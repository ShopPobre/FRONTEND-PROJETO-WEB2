import { Component, inject, input, signal, computed, OnInit } from '@angular/core';
import { FormEdit } from '../form-edit/form-edit';
import { ActionsFooter } from '../actions-footer/actions-footer';
import { ProductService } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/category.service';
import { SwalService } from '../../../core/services/swal.service';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { ProductResponseDTO } from '../../../core/models/product.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-form',
  imports: [FormEdit, ActionsFooter],
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss',
})
export class ProductForm implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private swalService = inject(SwalService);
  private router = inject(Router);

  navegar = input<string>('/admin/products');
  productId = input<number | null>(null);

  label = computed(() => (this.productId() ? 'Editar Produto' : 'Criar Produto'));

  private original = signal<ProductResponseDTO | null>(null);

  name = signal('');
  description = signal('');
  categoryName = signal('');
  price = signal('');

  isDirty = computed(() => {
    const o = this.original();

    // modo criação — habilita quando campos obrigatórios preenchidos
    if (!o) {
      return this.name() !== '' && this.price() !== '' && this.categoryName() !== '';
    }

    // modo edição — habilita se algo mudou
    return (
      this.name() !== o.name ||
      this.description() !== (o.description ?? '') ||
      this.price() !== String(o.price)
      // categoryName não comparamos com o original pois vem só o id do back
    );
  });

  ngOnInit() {
    console.log(this.productId());
    if (this.productId()) {
      this.loadProduct();
    }
  }

  private loadProduct() {
    this.productService.getProductById(String(this.productId()!)).subscribe(
      (data: any) => {
        const product = data as ProductResponseDTO;
        this.name.set(product.name);
        this.description.set(product.description ?? '');
        this.price.set(String(product.price));
        this.original.set({ ...product });

        // busca o nome da categoria pelo id
        this.categoryService.getCategories().subscribe((categories) => {
          const category = categories.find((c) => c.id === product.categoryId);
          this.categoryName.set(category?.name ?? '');
        });
      },
      (err: any) => console.error(err),
    );
  }

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

          return this.productId()
            ? this.productService.updateProduct(String(this.productId()!), payload)
            : this.productService.createProduct(payload);
        }),
      )
      .subscribe({
        next: () => {
          this.swalService.success(this.productId() ? 'Produto atualizado!' : 'Produto criado!');
          this.router.navigate([this.navegar()]);
        },
        error: (err) => {
          const mensagem = err.error?.error || err.error?.message || 'Erro ao salvar produto';
          this.swalService.error(mensagem);
        },
      });
  }

}
