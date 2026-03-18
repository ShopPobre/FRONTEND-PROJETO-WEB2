import { Injectable } from '@angular/core';

/**
 * Guarda temporariamente os dados de pagamento ao sair do carrinho para o checkout.
 * Evita perder clientSecret quando o state da navegação não está disponível no Angular.
 */
@Injectable({
  providedIn: 'root',
})
export class CheckoutDataService {
  private clientSecret: string | null = null;
  private orderTotal: number | null = null;
  private orderId: number | null = null;

  setPaymentData(data: {
    clientSecret: string;
    orderTotal: number;
    orderId: number;
  }): void {
    this.clientSecret = data.clientSecret;
    this.orderTotal = data.orderTotal;
    this.orderId = data.orderId;
  }

  getPaymentData(): {
    clientSecret: string | null;
    orderTotal: number | null;
    orderId: number | null;
  } {
    const data = {
      clientSecret: this.clientSecret,
      orderTotal: this.orderTotal,
      orderId: this.orderId,
    };
    this.clear();
    return data;
  }

  private clear(): void {
    this.clientSecret = null;
    this.orderTotal = null;
    this.orderId = null;
  }
}
