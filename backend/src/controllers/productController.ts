import { Request, Response } from 'express';
import { Product } from '../models/Product';
import type { CreateProductDto, ProductCategory } from '../types/product';

const CATEGORIES: ProductCategory[] = ['Men', 'Women', 'Accessories'];

export async function getProducts(req: Request, res: Response): Promise<void> {
  try {
    const filter: Record<string, unknown> = {};
    const category = req.query.category as string | undefined;

    if (category) {
      if (!CATEGORIES.includes(category as ProductCategory)) {
        res.status(400).json({ message: 'Invalid category filter' });
        return;
      }
      filter.category = category;
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products', error });
  }
}

export async function getProductById(req: Request, res: Response): Promise<void> {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch product', error });
  }
}

export async function createProduct(req: Request, res: Response): Promise<void> {
  try {
    const body = req.body as CreateProductDto;
    const product = await Product.create(body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create product', error });
  }
}

export async function updateProduct(req: Request, res: Response): Promise<void> {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update product', error });
  }
}

export async function deleteProduct(req: Request, res: Response): Promise<void> {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.json({ message: 'Product deleted', id: product._id });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete product', error });
  }
}
