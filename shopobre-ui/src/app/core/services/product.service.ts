import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { ApiService } from './api.service';
import { ProductResponseDTO, ProductDetailView, ProductImageDTO } from '../models/product.model';

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
  }
}
