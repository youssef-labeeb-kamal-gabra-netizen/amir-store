export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName?: string;
  itemCount?: number;
}

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  categoryId: string;
  categoryName: string;
  images: string[];
  brand?: string;
  model?: string;
  specifications: ProductSpecification[];
  featured?: boolean;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilterParams {
  category?: string;
  search?: string;
  sort?: "newest" | "name_asc" | "name_desc";
  page?: number;
  limit?: number;
}
