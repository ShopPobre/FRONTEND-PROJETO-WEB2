import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import {
  CreateOrderDTO,
  CreateOrderItemDTO,
  OrderResponseDTO,
  PaginatedOrdersResponse,
  OrderDetailResponseDTO,
} from '../models/order.model';
import { CartItem } from '../models/cart.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(
    private http: HttpClient,
    private api: ApiService,
    private authService: AuthService,
  ) {}

  private get url() {
    return `${this.api.getBaseUrl()}/orders`;
  }

  private get authHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`,
    });
  }
  createOrderFromCart(
    cartItems: CartItem[],
    addressId: string,
  ): Observable<OrderResponseDTO> {
    const userId = this.authService.getUserId();

    if (!userId) {
      throw new Error('Usuário não autenticado');
    }

    const items: CreateOrderItemDTO[] = cartItems.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));

    const payload: CreateOrderDTO = {
      userId,
      addressId,
      items,
    };

    return this.http.post<OrderResponseDTO>(this.url, payload, {
      headers: this.authHeaders,
    });
  }

  getOrdersByCurrentUser(page = 1, limit = 10): Observable<PaginatedOrdersResponse> {
    const userId = this.authService.getUserId();

    if (!userId) {
      throw new Error('Usuário não autenticado');
    }

    const endpoint = `${this.url}/user/${userId}`;
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<PaginatedOrdersResponse>(endpoint, {
      headers: this.authHeaders,
      params,
    });
  }

  getOrderById(id: number): Observable<OrderResponseDTO> {
    const endpoint = `${this.url}/${id}`;
    return this.http.get<OrderResponseDTO>(endpoint, {
      headers: this.authHeaders,
    });
  }

  getOrderDetailsById(id: number): Observable<OrderDetailResponseDTO> {
    const endpoint = `${this.url}/${id}/details`;
    return this.http.get<OrderDetailResponseDTO>(endpoint, {
      headers: this.authHeaders,
    });
  }
}

