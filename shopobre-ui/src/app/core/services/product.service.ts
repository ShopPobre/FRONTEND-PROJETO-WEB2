import { Observable, map, catchError, of } from 'rxjs';
import { ProductResponseDTO, ProductDetailView, ProductImageDTO } from '../models/product.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private get url() {
    return `${this.api.getBaseUrl()}/products`;
  }

  constructor(
    private http: HttpClient,
    private api: ApiService
  ) {}

  getById(id: number): Observable<ProductDetailView | null> {
    return this.http.get<ProductResponseDTO>(`${this.url}/${id}`).pipe(
      map((p) => this.toDetailView(p)),
      catchError(() => of(null))
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
        ? imageDtos.map((img) =>
            img.urlPath.startsWith('/api/')
              ? `${serverBase}${img.urlPath}`
              : `${baseApi}${img.urlPath}`
          )
        : this.defaultPlaceholderImages();

    const { images: _images, mainImage: _main, ...rest } = p;

    const view: ProductDetailView = {
      ...rest,
      images: imageUrls,
    };

    return view;
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
  constructor(
    private http: HttpClient,
    private api: ApiService,
    private router: Router,
    private authService: AuthService,
  ) {}

  private get url() {
    return `${this.api.getBaseUrl()}/products`;
  }

  getProducts() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`,
    });

    return this.http.get(this.url, { headers });
  }

  createProduct(productData: any) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`,
    });

    return this.http.post(this.url, productData, { headers });
  }

  getProductById(productID: string) {
    const urlGET = `${this.url}/${productID}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`,
    });
    return this.http.get(urlGET, { headers });
  }

  updateProduct(productID: string, payload: any) {
    const urlGET = `${this.url}/${productID}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`,
    });

    return this.http.put(urlGET, payload, { headers });
  }

  deleteProduct(productID: string) {
    const urlGET = `${this.url}/${productID}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`,
    });

    return this.http.delete(urlGET, { headers });

  }
}
