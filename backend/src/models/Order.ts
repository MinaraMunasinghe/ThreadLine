import mongoose, { Schema, Document } from 'mongoose';
import type { IOrder, PaymentStatus } from '../types/order';

export interface OrderDocument extends Omit<IOrder, '_id'>, Document {}

const orderItemSchema = new Schema(
  {
    productId: { type: String, required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    size: { type: String, required: true },
  },
  { _id: false }
);

const billingDetailsSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
  },
  { _id: false }
);

const deliveryDetailsSchema = new Schema(
  {
    shippingAddress: { type: String, required: true },
    shippingCity: { type: String, required: true },
  },
  { _id: false }
);

const orderSchema = new Schema<OrderDocument>(
  {
    orderId: { type: String, required: true, unique: true },
    items: { type: [orderItemSchema], required: true },
    totalAmount: { type: Number, required: true, min: 0 },
    paymentStatus: {
      type: String,
      required: true,
      enum: ['Pending', 'Paid', 'Failed'] satisfies PaymentStatus[],
      default: 'Pending',
    },
    billingDetails: { type: billingDetailsSchema, required: true },
    deliveryDetails: { type: deliveryDetailsSchema, required: true },
  },
  { timestamps: true }
);

export const Order = mongoose.model<OrderDocument>('Order', orderSchema);
