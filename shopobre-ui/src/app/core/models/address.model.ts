export type AddressType = 'CASA' | 'TRABALHO' | 'OUTRO';

export interface Address {
  rua: string;
  numero: number;
  cep: string;
  cidade: string;
  estado: string;
  tipo: AddressType;
}

export interface AddressResponse {
  id: string;
  rua: string;
  numero: number;
  cep: string;
  cidade: string;
  estado: string;
  tipo: AddressType;
}
