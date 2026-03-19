import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import {
  CreatePaymentDTO,
  PaymentMethod,
  PaymentResponseDTO,
} from '../models/payment.model';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  constructor(
    private http: HttpClient,
    private api: ApiService,
    private authService: AuthService,
  ) {}

  private get url() {
    return `${this.api.getBaseUrl()}/payments`;
  }

  private get authHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`,
    });
  }

  createPayment(orderId: number, method: PaymentMethod) {
    const payload: CreatePaymentDTO = {
      orderId,
      method,
    };

    return this.http.post<PaymentResponseDTO>(this.url, payload, {
      headers: this.authHeaders,
    });
  }

  getClientSecretByOrderId(orderId: number) {
    return this.http.get<{
      clientSecret: string;
      orderTotal: number;
    }>(`${this.url}/by-order/${orderId}`, {
      headers: this.authHeaders,
    });
  }
}

