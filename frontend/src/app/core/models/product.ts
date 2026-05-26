/** Aligned with backend src/types/product.ts */
export type ProductCategory = 'Men' | 'Women' | 'Accessories';

export interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: ProductCategory;
  sizes: string[];
  imageUrl: string;
  stock: number;
  isFeatured: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductDto {
  title: string;
  description: string;
  price: number;
  category: ProductCategory;
  sizes: string[];
  imageUrl: string;
  stock: number;
  isFeatured?: boolean;
}

export type UpdateProductDto = Partial<CreateProductDto>;
