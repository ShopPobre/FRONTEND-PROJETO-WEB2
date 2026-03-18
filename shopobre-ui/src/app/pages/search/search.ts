import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs';

import { ProductService } from '../../core/services/product.service';
import { CategoryService } from '../../core/services/category.service';
import { AuthService } from '../../core/services/auth.service';
import { ProductResponseDTO } from '../../core/models/product.model';
import { Category } from '../../core/models/category.model';
import { Header } from '../../shared/components/header/header';
import { Footer } from '../../shared/components/footer/footer';

@Component({
  selector: 'app-search-page',
  imports: [CommonModule, RouterLink, Header, Footer],
  templateUrl: './search.html',
  styleUrl: './search.scss',
})
export class SearchPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  private readonly authService = inject(AuthService);

  readonly isLoading = signal(false);
  readonly products = signal<ProductResponseDTO[]>([]);
  readonly categories = signal<Category[]>([]);
  readonly query = signal<string>('');

  // Filtros reutilizados
  readonly minPrice = signal<number | null>(null);
  readonly maxPrice = signal<number | null>(null);
  readonly sortOption = signal<'relevance' | 'price-asc' | 'price-desc' | 'newest'>('relevance');

  // Paginação
  readonly pageSize = 12;
  readonly currentPage = signal(1);

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const q = params.get('q') ?? '';
      this.query.set(q);
      this.loadData();
    });
  }

  onMinPriceChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.minPrice.set(value ? Number(value) : null);
  }

  onMaxPriceChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.maxPrice.set(value ? Number(value) : null);
  }

  onSortChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as
      'relevance' | 'price-asc' | 'price-desc' | 'newest';
    this.sortOption.set(value);
  }

  getProductImage(product: ProductResponseDTO): string {
    const rawPath =
      product.mainImage?.urlPath ??
      product.images?.[0]?.urlPath ??
      '';

    return this.productService.buildImageUrl(rawPath);
  }

  readonly filteredProducts = computed(() => {
    const q = this.query().toLowerCase().trim();
    let list = this.products().filter((p) => p.isActive);

    if (q) {
      list = list.filter((p) => this.relevanceScore(p, q) > 0);
    }

    const min = this.minPrice();
    const max = this.maxPrice();

    if (min != null) {
      list = list.filter((p) => p.price >= min);
    }
    if (max != null) {
      list = list.filter((p) => p.price <= max);
    }

    switch (this.sortOption()) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        list.sort((a, b) => (b.createdAt?.localeCompare(a.createdAt ?? '') ?? 0));
        break;
      case 'relevance':
        if (q) {
          list.sort((a, b) => this.relevanceScore(b, q) - this.relevanceScore(a, q));
        }
        break;
      default:
        break;
    }

    return list;
  });
  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filteredProducts().length / this.pageSize))
  );

  readonly paginatedProducts = computed(() => {
    const page = this.currentPage();
    const start = (page - 1) * this.pageSize;
    return this.filteredProducts().slice(start, start + this.pageSize);
  });

  goToPage(page: number): void {
    const total = this.totalPages();
    const target = Math.min(Math.max(1, page), total);
    this.currentPage.set(target);
  }

  private relevanceScore(p: ProductResponseDTO, q: string): number {
    const name = p.name.toLowerCase();
    const desc = (p.description ?? '').toLowerCase();
    const category = this.categories().find((c) => c.id === p.categoryId);
    const categoryName = category?.name.toLowerCase() ?? '';

    let score = 0;

    if (name === q) score += 100;
    if (name.startsWith(q)) score += 50;
    if (name.includes(q)) score += 30;

    if (desc === q) score += 20;
    if (desc.startsWith(q)) score += 10;
    if (desc.includes(q)) score += 5;

    if (categoryName) {
      if (categoryName === q) score += 80;
      if (categoryName.startsWith(q)) score += 40;
      if (categoryName.includes(q)) score += 25;
    }

    return score;
  }

  private loadData(): void {
    this.isLoading.set(true);

    const hasToken = !!this.authService.getToken();

    const categories$ = this.categoryService.getCategoriesPublic();

    const products$ = hasToken
      ? this.productService.getProducts().pipe(
          map((resp: any) => resp?.data ?? resp ?? [] as ProductResponseDTO[])
        )
      : this.productService.getProductsPublic();

    categories$.subscribe({
      next: (cats) => {
        this.categories.set(cats ?? []);

        products$.subscribe({
          next: (products) => {
            this.products.set(products ?? []);
            this.isLoading.set(false);
          },
          error: () => {
            this.products.set([]);
            this.isLoading.set(false);
          },
        });
      },
      error: () => {
        this.categories.set([]);
        this.isLoading.set(false);
      },
    });
  }
}

