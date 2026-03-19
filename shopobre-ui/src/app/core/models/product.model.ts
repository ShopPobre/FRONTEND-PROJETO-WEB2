export interface ProductImageDTO {
  id: number;
  productId: number;
  objectKey: string;
  originalName: string;
  mimeType: string;
  size: number;
  sortOrder: number;
  urlPath: string;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface ProductResponseDTO {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  categoryId: number;
  isActive: boolean;
  images?: ProductImageDTO[];
  mainImage?: ProductImageDTO | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface ProductDetailView {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  categoryId: number;
  isActive: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
  images: string[];
}