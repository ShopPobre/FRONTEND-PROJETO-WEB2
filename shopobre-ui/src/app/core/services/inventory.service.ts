import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { InventoryResponseDTO } from '../models/inventory.model';
import { ProductService } from './product.service';

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private http = inject(HttpClient);
  private api = inject(ApiService);
  private authService = inject(AuthService);
  private productService = inject(ProductService);

  private get url() {
    return `${this.api.getBaseUrl()}/inventory`;
  }

  private get headers() {
    return new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`,
    });
  }

  getAll(): Observable<InventoryResponseDTO[]> {
    return this.productService.getProducts().pipe(
      switchMap((products) => {
        const requests = products.map((product: { id: any }) =>
          this.http.get<InventoryResponseDTO>(`${this.url}/${product.id}`, {
            headers: this.headers,
          }),
        );
        return forkJoin(requests);
      }),
    );
  }

  increase(productId: number, data: { quantity: number }): Observable<InventoryResponseDTO> {
    return this.http.patch<InventoryResponseDTO>(`${this.url}/${productId}/increase`, data, {
      headers: this.headers,
    });
  }

  decrease(productId: number, data: { quantity: number }): Observable<InventoryResponseDTO> {
    return this.http.patch<InventoryResponseDTO>(`${this.url}/${productId}/decrease`, data, {
      headers: this.headers,
    });
  }
}
