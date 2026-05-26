import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import productRoutes from './routes/productRoutes';
import paymentRoutes from './routes/paymentRoutes';

const app = express();

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'ThreadLine API' });
});

app.use('/api/products', productRoutes);
app.use('/api/payments', paymentRoutes);

export default app;
