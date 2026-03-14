import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
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
