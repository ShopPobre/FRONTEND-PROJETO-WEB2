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

interface CategorySlugConfig {
  slug: string;
  label: string;
}

@Component({
  selector: 'app-category-page',
  imports: [CommonModule, RouterLink, Header, Footer],
  templateUrl: './category.html',
  styleUrl: './category.scss',
})
export class CategoryPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  private readonly authService = inject(AuthService);

  readonly isLoading = signal(false);
  readonly products = signal<ProductResponseDTO[]>([]);
  readonly categories = signal<Category[]>([]);

  // Filtros
  readonly minPrice = signal<number | null>(null);
  readonly maxPrice = signal<number | null>(null);
  readonly sortOption = signal<'relevance' | 'price-asc' | 'price-desc' | 'newest'>('relevance');

  // Paginação
  readonly pageSize = 12;
  readonly currentPage = signal(1);

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

  readonly slugConfigs: CategorySlugConfig[] = [
    { slug: 'ofertas-do-dia', label: 'Ofertas do dia' },
    { slug: 'mais-vendidos', label: 'Mais vendidos' },
    { slug: 'games', label: 'Games' },
    { slug: 'livros', label: 'Livros' },
    { slug: 'casa', label: 'Casa' },
    { slug: 'eletronicos', label: 'Eletrônicos' },
    { slug: 'placas-video', label: 'Placa de Vídeo' },
    { slug: 'brinquedos-jogos', label: 'Brinquedos e Jogos' },
    { slug: 'computadores', label: 'Computadores' },
    { slug: 'moda', label: 'Moda' },
    { slug: 'beleza', label: 'Beleza' },
    { slug: 'mercado', label: 'Mercado' },
  ];

  readonly currentSlug = signal<string | null>(null);

  readonly currentConfig = computed(() => {
    const slug = this.currentSlug();
    if (!slug) return null;
    return this.slugConfigs.find((c) => c.slug === slug) ?? null;
  });

  // Produtos filtrados por categoria
  private readonly productsByCategory = computed(() => {
    const config = this.currentConfig();
    const allProducts = this.products().filter((p) => p.isActive);
    if (!config) {
      return [];
    }

    const category = this.matchCategoryByConfig(config);
    if (!category) {
      return [];
    }

    return allProducts.filter((p) => p.categoryId === category.id);
  });

  // Produtos com filtros de preço + ordenação aplicados
  readonly filteredProducts = computed(() => {
    let list = [...this.productsByCategory()];

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

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.currentSlug.set(params.get('slug'));
      this.loadData();
    });
  }

  getProductImage(product: ProductResponseDTO): string {
    const rawPath =
      product.mainImage?.urlPath ??
      product.images?.[0]?.urlPath ??
      '';

    return this.productService.buildImageUrl(rawPath);
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

  private matchCategoryByConfig(config: CategorySlugConfig): Category | undefined {
    const all = this.categories();
    return all.find((c) =>
      c.name.toLowerCase().includes(config.label.toLowerCase())
    );
  }
}

