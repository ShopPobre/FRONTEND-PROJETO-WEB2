export type PaymentMethod = 'CREDIT_CARD' | 'PIX';

export interface CreatePaymentDTO {
  orderId: number;
  method: PaymentMethod;
}

export interface PaymentResponseDTO {
  clientSecret: string | null;
}

