import mongoose, { Schema, Document } from 'mongoose';
import type { IProduct, ProductCategory } from '../types/product';

export interface ProductDocument extends Omit<IProduct, '_id'>, Document {}

const productSchema = new Schema<ProductDocument>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      required: true,
      enum: ['Men', 'Women', 'Accessories'] satisfies ProductCategory[],
    },
    sizes: { type: [String], required: true, default: [] },
    imageUrl: { type: String, required: true },
    stock: { type: Number, required: true, min: 0, default: 0 },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

productSchema.index({ category: 1 });
productSchema.index({ isFeatured: 1 });

export const Product = mongoose.model<ProductDocument>('Product', productSchema);
