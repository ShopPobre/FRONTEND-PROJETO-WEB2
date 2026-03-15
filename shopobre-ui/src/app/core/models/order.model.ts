export type OrderStatus = "PENDENTE" | "CONFIRMADO" | "EM_PREPARACAO" | "ENVIADO" | "ENTREGUE" | "CANCELADO";

export interface OrderResponseDTO {
    id: number;
    userId: string;
    addressId: string;
    status: OrderStatus;
    total: number;
    createdAt?: Date | null;
    updatedAt?: Date | null;
}