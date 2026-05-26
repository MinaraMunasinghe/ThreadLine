export type ProductCategory = 'Men' | 'Women' | 'Accessories';

export interface IProduct {
  _id?: string;
  title: string;
  description: string;
  price: number;
  category: ProductCategory;
  sizes: string[];
  imageUrl: string;
  stock: number;
  isFeatured: boolean;
  createdAt?: Date;
  updatedAt?: Date;
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
