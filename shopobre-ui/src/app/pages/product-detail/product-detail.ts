import { Component, OnInit, OnDestroy, signal, computed, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Header } from '../../shared/components/header/header';
import { Footer } from '../../shared/components/footer/footer';
import { Breadcrumb } from '../../shared/components/breadcrumb/breadcrumb';
import { ProductService } from '../../core/services/product.service';
import { CategoryService } from '../../core/services/category.service';
import { CartService } from '../../core/services/cart.service';
import { ProductDetailView } from '../../core/models/product.model';
import { BreadcrumbItem } from '../../shared/components/breadcrumb/breadcrumb';

const THUMB_SIZE = 138;
const THUMB_GAP = 16;
const MAIN_WIDTH = 600;
const GAP_MAIN_THUMBS = 30;
const AUTO_CHANGE_MS = 6000;
const MAX_THUMBNAILS = 4;

@Component({
  selector: 'app-product-detail',
  imports: [Header, Footer, Breadcrumb, CurrencyPipe],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetail implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private cartService = inject(CartService);

  product = signal<ProductDetailView | null>(null);
  categoryName = signal<string>('');
  quantity = signal(1);
  selectedImageIndex = signal(0);
  modalVisible = signal(false);
  private autoChangeInterval: ReturnType<typeof setInterval> | null = null;

  images = computed(() => this.product()?.images ?? []);
  mainImage = computed(() => {
    const imgs = this.images();
    const idx = this.selectedImageIndex();
    return imgs[idx] ?? imgs[0] ?? '';
  });
  thumbnails = computed(() => {
    const imgs = this.images();
    const hasMore = imgs.length > MAX_THUMBNAILS;
    const list = hasMore ? imgs.slice(0, MAX_THUMBNAILS - 1) : imgs.slice(0, MAX_THUMBNAILS);
    return { list, hasMore, total: imgs.length };
  });

  private categorySlugFromName(name: string): string | null {
    const n = (name ?? '').toLowerCase();
    if (!n) return null;
    // precisa bater com `CategoryPage.slugConfigs` e com os links do header/home
    if (n.includes('games')) return 'games';
    if (n.includes('celulares')) return 'celulares';
    if (n.includes('papelaria')) return 'material-escolar';
    if (n.includes('computadores')) return 'computadores';
    if (n.includes('livros')) return 'livros';
    if (n.includes('placa de vídeo') || n.includes('placa de video')) return 'placas-video';
    if (n.includes('eletr')) return 'eletronicos';
    if (n.includes('casa')) return 'casa';
    if (n.includes('brinquedos')) return 'brinquedos-jogos';
    if (n.includes('moda')) return 'moda';
    if (n.includes('beleza')) return 'beleza';
    if (n.includes('mercado')) return 'mercado';
    return null;
  }

  breadcrumbItems = computed((): BreadcrumbItem[] => {
    const p = this.product();
    const cat = this.categoryName();
    const home: BreadcrumbItem = { label: 'Home', link: '/home' };
    const slug = this.categorySlugFromName(cat);
    const category: BreadcrumbItem = cat
      ? { label: cat, link: slug ? `/category/${slug}` : undefined }
      : { label: 'Categoria' };
    const productName: BreadcrumbItem = { label: p?.name ?? 'Produto' };
    return [home, category, productName];
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    const numId = Number(id);
    if (Number.isNaN(numId)) return;
    this.productService.getById(numId).subscribe((p) => {
      this.product.set(p ?? null);
      if (p?.categoryId) {
        this.categoryService.getByIdPublic(p.categoryId).subscribe((c) => {
          this.categoryName.set(c?.name ?? '');
        });
      }
    });
    this.startAutoChange();
  }

  ngOnDestroy(): void {
    this.stopAutoChange();
  }

  private startAutoChange(): void {
    this.stopAutoChange();
    this.autoChangeInterval = setInterval(() => {
      const imgs = this.images();
      if (imgs.length <= 1) return;
      const next = (this.selectedImageIndex() + 1) % imgs.length;
      this.selectedImageIndex.set(next);
    }, AUTO_CHANGE_MS);
  }

  private stopAutoChange(): void {
    if (this.autoChangeInterval) {
      clearInterval(this.autoChangeInterval);
      this.autoChangeInterval = null;
    }
  }

  selectImage(index: number): void {
    this.stopAutoChange();
    this.selectedImageIndex.set(index);
  }

  onGalleryMouseEnter(): void {
    this.stopAutoChange();
  }

  onGalleryMouseLeave(): void {
    this.startAutoChange();
  }

  openModal(): void {
    this.modalVisible.set(true);
  }

  closeModal(): void {
    this.modalVisible.set(false);
  }

  incrementQuantity(): void {
    this.quantity.update((q) => q + 1);
  }

  decrementQuantity(): void {
    this.quantity.update((q) => Math.max(1, q - 1));
  }

  buyNow(): void {
    const p = this.product();
    if (!p) return;
    this.cartService.add({
      productId: p.id,
      name: p.name,
      price: p.price,
      imageUrl: this.mainImage(),
      quantity: this.quantity(),
    });
    this.router.navigate(['/cart']);
  }

  addToCart(): void {
    const p = this.product();
    if (!p) return;
    this.cartService.add({
      productId: p.id,
      name: p.name,
      price: p.price,
      imageUrl: this.mainImage(),
      quantity: this.quantity(),
    });
    this.router.navigate(['/cart']);
  }
}
