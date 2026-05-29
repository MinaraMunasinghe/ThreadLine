import dotenv from 'dotenv';

dotenv.config();

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function optionalEnv(key: string, fallback: string): string {
  return process.env[key] ?? fallback;
}

export const env = {
  port: parseInt(optionalEnv('PORT', '5000'), 10),
  nodeEnv: optionalEnv('NODE_ENV', 'development'),
  mongodbUri: requireEnv('MONGODB_URI'),
  clientUrl: optionalEnv('CLIENT_URL', 'http://localhost:4200'),
  adminApiKey: optionalEnv('ADMIN_API_KEY', 'dev-admin-key'),
  jwtSecret: requireEnv('JWT_SECRET'),
  payhere: {
    merchantId: optionalEnv('PAYHERE_MERCHANT_ID', '1210001'),
    merchantSecret: optionalEnv('PAYHERE_MERCHANT_SECRET', 'sandbox-secret'),
    currency: optionalEnv('PAYHERE_CURRENCY', 'LKR'),
    returnUrl: optionalEnv('PAYHERE_RETURN_URL', 'http://localhost:4200/checkout/success'),
    cancelUrl: optionalEnv('PAYHERE_CANCEL_URL', 'http://localhost:4200/checkout/cancel'),
    notifyUrl: optionalEnv('PAYHERE_NOTIFY_URL', 'http://localhost:5000/api/payments/notify'),
  },
} as const;
