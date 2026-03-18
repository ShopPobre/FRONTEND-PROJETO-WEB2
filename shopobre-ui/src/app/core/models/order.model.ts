export type OrderStatus =
  | 'PENDENTE'
  | 'CONFIRMADO'
  | 'EM_PREPARACAO'
  | 'ENVIADO'
  | 'ENTREGUE'
  | 'CANCELADO';

export interface CreateOrderItemDTO {
  productId: number;
  quantity: number;
}

export interface CreateOrderDTO {
  userId: string;
  addressId: string;
  items: CreateOrderItemDTO[];
}

export interface OrderResponseDTO {
  id: number;
  userId: string;
  addressId: string;
  status: OrderStatus;
  total: number;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface OrderItemDetailDTO {
  id: number;
  product: {
    id: number;
    name: string;
    description?: string | null;
    price: number;
    categoryId: number;
    isActive: boolean;
    mainImage?: {
      id: number;
      url: string;
      altText?: string | null;
      isMain: boolean;
      createdAt?: string | null;
      updatedAt?: string | null;
    } | null;
  };
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface OrderDetailResponseDTO {
  id: number;
  user: {
    id: string;
    name: string;
    email: string;
    cpf: string;
    telefone: string;
  };
  address: {
    id: string;
    rua: string;
    numero: number;
    cep: string;
    cidade: string;
    estado: string;
    tipo: string;
  };
  items: OrderItemDetailDTO[];
  status: OrderStatus;
  total: number;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface PaginatedOrdersResponse {
  data: OrderResponseDTO[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

