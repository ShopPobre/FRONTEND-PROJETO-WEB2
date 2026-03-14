export interface Category {
  id: number;
  name: string;
}

export interface CategoryResponse {
  data: Category[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}