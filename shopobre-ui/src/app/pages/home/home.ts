import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Header } from '../../shared/components/header/header';
import { Footer } from '../../shared/components/footer/footer';
import { ProductService } from '../../core/services/product.service';
import { CategoryService } from '../../core/services/category.service';
import { AuthService } from '../../core/services/auth.service';
import { ProductResponseDTO } from '../../core/models/product.model';
import { Category } from '../../core/models/category.model';
import { forkJoin, map } from 'rxjs';

interface HomeCategoryLink {
  label: string;
  slug: string;
}

interface HomeSectionConfig {
  id: string;
  title: string;
  categoryMatch: string;
  limit: number;
}

@Component({
  selector: 'app-home',
  imports: [Header, Footer, CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  private readonly authService = inject(AuthService);

  readonly isLoading = signal(false);
  readonly products = signal<ProductResponseDTO[]>([]);
  readonly categories = signal<Category[]>([]);

  readonly categoryLinks: HomeCategoryLink[] = [
    { label: 'Ofertas do dia', slug: 'ofertas-do-dia' },
    { label: 'Mais vendidos', slug: 'mais-vendidos' },
    { label: 'Games', slug: 'games' },
    { label: 'Livros', slug: 'livros' },
    { label: 'Casa', slug: 'casa' },
    { label: 'Eletrônicos', slug: 'eletronicos' },
    { label: 'Brinquedos e Jogos', slug: 'brinquedos-jogos' },
    { label: 'Computadores', slug: 'computadores' },
    { label: 'Moda', slug: 'moda' },
    { label: 'Beleza', slug: 'beleza' },
    { label: 'Mercado', slug: 'mercado' },
  ];

  private readonly sectionConfigs: HomeSectionConfig[] = [
    {
      id: 'games',
      title: 'Mais vendidos em Games e Consoles',
      categoryMatch: 'Games',
      limit: 7,
    },
    {
      id: 'celulares',
      title: 'Em destaque em Celulares e Comunicação',
      categoryMatch: 'Celulares',
      limit: 7,
    },
    {
      id: 'material-escolar',
      title: 'Papelaria e Material Escolar',
      categoryMatch: 'Papelaria',
      limit: 7,
    },
    {
      id: 'computadores',
      title: 'Computadores e Informática',
      categoryMatch: 'Computadores',
      limit: 7,
    },
    {
      id: 'livros',
      title: 'Livros em destaque',
      categoryMatch: 'Livros',
      limit: 7,
    },
    {
      id: 'placas-video',
      title: 'Placas de vídeo e componentes',
      categoryMatch: 'Placa de Vídeo',
      limit: 7,
    },
  ];

  readonly sections = signal<HomeSectionConfig[]>(this.sectionConfigs);

  readonly featuredProducts = computed(() =>
    this.products()
      .filter((p) => p.isActive)
      .slice(0, 5)
  );

  ngOnInit(): void {
    this.loadData();
  }

  getSectionProducts(section: HomeSectionConfig): ProductResponseDTO[] {
    const categories = this.categories();
    const products = this.products().filter((p) => p.isActive);

    const matchedCategory = categories.find((c) =>
      c.name.toLowerCase().includes(section.categoryMatch.toLowerCase())
    );

    if (!matchedCategory) {
      return [];
    }

    return products
      .filter((p) => p.categoryId === matchedCategory.id)
      .slice(0, section.limit);
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

    const products$ = hasToken
      ? this.productService.getProducts().pipe(
          map((resp: any) => resp?.data ?? resp ?? [] as ProductResponseDTO[])
        )
      : this.productService.getProductsPublic();

    const categories$ = this.categoryService.getCategoriesPublic();

    forkJoin({
      products: products$,
      categories: categories$,
    }).subscribe({
      next: ({ products, categories }) => {
        this.products.set(products ?? []);
        this.categories.set(categories ?? []);
        this.isLoading.set(false);
      },
      error: () => {
        this.products.set([]);
        this.categories.set([]);
        this.isLoading.set(false);
      },
    });
  }
}
