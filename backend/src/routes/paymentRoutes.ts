import { Router } from 'express';
import { checkout, paymentNotify } from '../controllers/paymentController';

const router = Router();

router.post('/checkout', checkout);
router.post('/notify', paymentNotify);

export default router;
