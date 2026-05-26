export type PaymentStatus = 'Pending' | 'Paid' | 'Failed';

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  size: string;
}

export interface BillingDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
}

export interface DeliveryDetails {
  shippingAddress: string;
  shippingCity: string;
}

export interface IOrder {
  _id?: string;
  orderId: string;
  items: OrderItem[];
  totalAmount: number;
  paymentStatus: PaymentStatus;
  billingDetails: BillingDetails;
  deliveryDetails: DeliveryDetails;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CheckoutCartItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  size: string;
}

export interface CheckoutRequestBody {
  items: CheckoutCartItem[];
  billingDetails: BillingDetails;
  deliveryDetails: DeliveryDetails;
}

export interface PayHereCheckoutPayload {
  merchant_id: string;
  return_url: string;
  cancel_url: string;
  notify_url: string;
  order_id: string;
  items: string;
  currency: string;
  amount: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  delivery_address: string;
  delivery_city: string;
  hash: string;
}
