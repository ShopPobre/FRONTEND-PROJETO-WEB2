import { Component, inject, input, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { FormEdit } from '../form-edit/form-edit';
import { ActionsFooter } from '../actions-footer/actions-footer';
import { ProductService } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/category.service';
import { SwalService } from '../../../core/services/swal.service';
import { Router } from '@angular/router';
import { switchMap, from, concatMap, toArray, of, catchError, map } from 'rxjs';
import { ProductImageDTO, ProductResponseDTO } from '../../../core/models/product.model';
import { Category } from '../../../core/models/category.model';

@Component({
  selector: 'app-product-form',
  imports: [FormEdit, ActionsFooter],
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss',
})
export class ProductForm implements OnInit, OnDestroy {
  readonly productService = inject(ProductService);
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

  categories = signal<Category[]>([]);
  categoryOptions = computed(() => this.categories().map((c) => c.name));
  categoryQuery = computed(() => this.categoryName().trim().toLowerCase());
  hasExactCategoryMatch = computed(() => {
    const q = this.categoryQuery();
    if (!q) return false;
    return this.categories().some((c) => c.name.trim().toLowerCase() === q);
  });

  existingImages = signal<ProductImageDTO[]>([]);
  selectedFiles = signal<File[]>([]);
  private previewDataUrls = new Map<File, string>();
  private readonly loadingPreview =
    'data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=';

  canSave = computed(() => {
    const o = this.original();

    if (!o) {
      return (
        this.name().trim() !== '' &&
        this.price().trim() !== '' &&
        this.categoryName().trim() !== '' &&
        this.selectedFiles().length > 0
      );
    }

    const hasFieldChanges =
      this.name() !== o.name ||
      this.description() !== (o.description ?? '') ||
      this.price() !== String(o.price)
      ;

    const hasNewImages = this.selectedFiles().length > 0;
    return hasFieldChanges || hasNewImages;
  });

  ngOnInit() {
    this.categoryService.getCategoriesPublic().subscribe((cats) => {
      const sorted = [...cats].sort((a, b) => a.name.localeCompare(b.name));
      this.categories.set(sorted);
    });
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
        this.existingImages.set(product.images ?? (product.mainImage ? [product.mainImage] : []));

        this.categoryService.getCategoriesPublic().subscribe((categories: Category[]) => {
          const sorted = [...categories].sort((a, b) => a.name.localeCompare(b.name));
          this.categories.set(sorted);
          const category = sorted.find((c: Category) => c.id === product.categoryId);
          this.categoryName.set(category?.name ?? '');
        });
      },
      (err: unknown) => console.error(err),
    );
  }

  onFilesSelected(ev: Event) {
    const inputEl = ev.target as HTMLInputElement | null;
    const list = inputEl?.files;
    if (!list || list.length === 0) return;

    const files = Array.from(list);
    const next = [...this.selectedFiles(), ...files];
    this.selectedFiles.set(next);

    for (const file of files) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = typeof reader.result === 'string' ? reader.result : null;
        if (!result) return;
        this.previewDataUrls.set(file, result);
      };
      reader.readAsDataURL(file);
    }

    if (inputEl) inputEl.value = '';
  }

  previewUrlForFile(file: File): string {
    return this.previewDataUrls.get(file) ?? this.loadingPreview;
  }

  removeSelectedFile(file: File) {
    this.previewDataUrls.delete(file);
    this.selectedFiles.set(this.selectedFiles().filter((f) => f !== file));
  }

  deleteExistingImage(img: ProductImageDTO) {
    const productId = this.productId();
    if (!productId) return;

    this.productService.deleteProductImage(productId, img.id).subscribe({
      next: () => {
        this.existingImages.set(this.existingImages().filter((i) => i.id !== img.id));
        this.swalService.success('Imagem removida!');
      },
      error: (err: { error?: { error?: string; message?: string } }) => {
        const mensagem = err.error?.error || err.error?.message || 'Erro ao remover imagem';
        this.swalService.error(mensagem);
      },
    });
  }

  saveProduct() {
    this.categoryService
      .findOrCreate(this.categoryName())
      .pipe(
        switchMap((category: Category) => {
          const payload = {
            name: this.name(),
            description: this.description(),
            categoryId: category.id,
            price: Number(this.price()),
          };

          return (this.productId()
            ? this.productService.updateProduct(String(this.productId()!), payload)
            : this.productService.createProduct(payload)
          ).pipe(
            map((resp: any) => (this.productId() ? this.productId()! : (resp?.id as number))),
          );
        }),
        switchMap((productId: number) => {
          const files = this.selectedFiles();
          if (!files.length) return of({ productId, uploaded: [] as ProductImageDTO[] });

          return from(files).pipe(
            concatMap((file) =>
              this.productService.uploadProductImage(productId, file).pipe(
                catchError(() => of(null as unknown as ProductImageDTO)),
              ),
            ),
            toArray(),
            map((uploaded) => ({ productId, uploaded: uploaded.filter(Boolean) as ProductImageDTO[] })),
          );
        }),
      )
      .subscribe({
        next: ({ uploaded }) => {
          if (uploaded?.length) {
            this.existingImages.set([...this.existingImages(), ...uploaded]);
            this.selectedFiles.set([]);
            this.previewDataUrls.clear();
          }

          this.swalService.success(this.productId() ? 'Produto atualizado!' : 'Produto criado!');
          this.router.navigate([this.navegar()]);
        },
        error: (err: { error?: { error?: string; message?: string } }) => {
          const mensagem = err.error?.error || err.error?.message || 'Erro ao salvar produto';
          this.swalService.error(mensagem);
        },
      });
  }

  ngOnDestroy(): void {
    this.previewDataUrls.clear();
  }
}
