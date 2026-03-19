import { Observable, map, catchError, of } from 'rxjs';
import { ProductResponseDTO, ProductDetailView, ProductImageDTO } from '../models/product.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);
  private api = inject(ApiService);
  private authService = inject(AuthService);

  private get url() {
    return `${this.api.getBaseUrl()}/products`;
  }

  getById(id: number): Observable<ProductDetailView | null> {
    return this.http.get<ProductResponseDTO>(`${this.url}/${id}`).pipe(
      map((p) => this.toDetailView(p)),
      catchError(() => of(null)),
    );
  }

  private toDetailView(p: ProductResponseDTO): ProductDetailView {
    const baseApi = this.api.getBaseUrl();
    const serverBase = baseApi.replace(/\/api\/?$/, '');

    const imageDtos: ProductImageDTO[] = (() => {
      if (p.images && p.images.length > 0) {
        return p.images;
      }
      if (p.mainImage) {
        return [p.mainImage];
      }
      return [];
    })();

    const imageUrls =
      imageDtos.length > 0
        ? imageDtos.map((img) => this.buildImageUrl(img.urlPath, baseApi, serverBase))
        : this.defaultPlaceholderImages();

    const { images: _images, mainImage: _main, ...rest } = p;

    const view: ProductDetailView = {
      ...rest,
      images: imageUrls,
    };

    return view;
  }

  buildImageUrl(urlPath: string, baseApiParam?: string, serverBaseParam?: string): string {
    const baseApi = baseApiParam ?? this.api.getBaseUrl();
    const serverBase = serverBaseParam ?? baseApi.replace(/\/api\/?$/, '');

    if (!urlPath) {
      return this.defaultPlaceholderImages()[0];
    }

    return urlPath.startsWith('/api/')
      ? `${serverBase}${urlPath}`
      : `${baseApi}${urlPath}`;
  }

  private defaultPlaceholderImages(): string[] {
    const base = 'https://placehold.co/600x600/e2e8f0/64748b';
    return [
      `${base}?text=Visão+1`,
      `${base}?text=Visão+2`,
      `${base}?text=Visão+3`,
      `${base}?text=Visão+4`,
      `${base}?text=Visão+5`,
    ];
  }

  private get authHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`,
    });
  }

  getProducts(): Observable<ProductResponseDTO[]> {
    return this.http
      .get<{ data: ProductResponseDTO[] }>(this.url, {
        headers: this.authHeaders,
      })
      .pipe(map((response) => response.data));
  }

  /**
   * Versão pública, sem header de autenticação.
   * Usada na Home, página de categoria e demais páginas abertas.
   */
  getProductsPublic(): Observable<ProductResponseDTO[]> {
    return this.http.get<any>(this.url).pipe(
      map((resp: any) => resp?.data ?? resp ?? []),
      catchError(() => of([] as ProductResponseDTO[]))
    );
  }

  createProduct(productData: unknown) {
    return this.http.post(this.url, productData, { headers: this.authHeaders });
  }

  getProductById(id: string): Observable<ProductResponseDTO> {
    return this.http.get<ProductResponseDTO>(`${this.url}/${id}`, {
      headers: this.authHeaders,
    });
  }

  updateProduct(productID: string, payload: unknown) {
    return this.http.put(`${this.url}/${productID}`, payload, { headers: this.authHeaders });
  }

  deleteProduct(productID: string) {
    return this.http.delete(`${this.url}/${productID}`, { headers: this.authHeaders });
  }

  uploadProductImage(productId: number, file: File): Observable<ProductImageDTO> {
    const form = new FormData();
    form.append('file', file, file.name);
    return this.http.post<ProductImageDTO>(`${this.url}/${productId}/images`, form, {
      headers: this.authHeaders,
    });
  }

  deleteProductImage(productId: number, imageId: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${productId}/images/${imageId}`, {
      headers: this.authHeaders,
    });
  }
}
