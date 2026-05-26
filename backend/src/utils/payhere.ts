import crypto from 'crypto';
import { env } from '../config/env';

function md5Upper(input: string): string {
  return crypto.createHash('md5').update(input).digest('hex').toUpperCase();
}

/**
 * PayHere checkout hash:
 * UPPERCASE(MD5(merchant_id + order_id + amount + currency + UPPERCASE(MD5(merchant_secret))))
 */
export function generatePayHereHash(
  orderId: string,
  amount: number,
  currency: string = env.payhere.currency
): string {
  const amountFormatted = amount.toFixed(2);
  const hashedSecret = md5Upper(env.payhere.merchantSecret);

  return md5Upper(
    env.payhere.merchantId +
      orderId +
      amountFormatted +
      currency +
      hashedSecret
  );
}

export function formatPayHereAmount(amount: number): string {
  return amount.toFixed(2);
}
