import { Request, Response } from 'express';
import crypto from 'crypto';
import { Order } from '../models/Order';
import { env } from '../config/env';
import { generateOrderId } from '../utils/orderId';
import { generatePayHereHash, formatPayHereAmount } from '../utils/payhere';
import type { CheckoutRequestBody, PayHereCheckoutPayload } from '../types/order';

function md5Upper(input: string): string {
  return crypto.createHash('md5').update(input).digest('hex').toUpperCase();
}

export async function checkout(req: Request, res: Response): Promise<void> {
  try {
    const body = req.body as CheckoutRequestBody;

    if (!body.items?.length) {
      res.status(400).json({ message: 'Cart is empty' });
      return;
    }

    if (!body.billingDetails || !body.deliveryDetails) {
      res.status(400).json({ message: 'Billing and delivery details are required' });
      return;
    }

    const totalAmount = body.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    if (totalAmount <= 0) {
      res.status(400).json({ message: 'Invalid order total' });
      return;
    }

    const orderId = generateOrderId();
    const amountFormatted = formatPayHereAmount(totalAmount);
    const hash = generatePayHereHash(orderId, totalAmount);

    const order = await Order.create({
      orderId,
      items: body.items,
      totalAmount,
      paymentStatus: 'Pending',
      billingDetails: body.billingDetails,
      deliveryDetails: body.deliveryDetails,
    });

    const itemsDescription = body.items
      .map((i) => `${i.title} (${i.size}) x${i.quantity}`)
      .join(', ');

    const payload: PayHereCheckoutPayload = {
      merchant_id: env.payhere.merchantId,
      return_url: env.payhere.returnUrl,
      cancel_url: env.payhere.cancelUrl,
      notify_url: env.payhere.notifyUrl,
      order_id: orderId,
      items: itemsDescription,
      currency: env.payhere.currency,
      amount: amountFormatted,
      first_name: body.billingDetails.firstName,
      last_name: body.billingDetails.lastName,
      email: body.billingDetails.email,
      phone: body.billingDetails.phone,
      address: body.billingDetails.address,
      city: body.billingDetails.city,
      country: body.billingDetails.country,
      delivery_address: body.deliveryDetails.shippingAddress,
      delivery_city: body.deliveryDetails.shippingCity,
      hash,
    };

    res.status(201).json({
      order: order.toObject(),
      payhere: payload,
      checkoutUrl: 'https://sandbox.payhere.lk/pay/checkout',
    });
  } catch (error) {
    res.status(500).json({ message: 'Checkout failed', error });
  }
}

/** PayHere server-to-server payment notification */
export async function paymentNotify(req: Request, res: Response): Promise<void> {
  try {
    const {
      merchant_id,
      order_id,
      payhere_amount,
      payhere_currency,
      status_code,
      md5sig,
    } = req.body as Record<string, string>;

    const localSig = md5Upper(
      merchant_id +
        order_id +
        payhere_amount +
        payhere_currency +
        status_code +
        md5Upper(env.payhere.merchantSecret)
    );

    if (localSig !== md5sig) {
      res.status(400).send('Invalid signature');
      return;
    }

    const paymentStatus = status_code === '2' ? 'Paid' : 'Failed';
    await Order.findOneAndUpdate({ orderId: order_id }, { paymentStatus });

    res.status(200).send('OK');
  } catch (error) {
    console.error('Payment notify error:', error);
    res.status(500).send('Error');
  }
}
