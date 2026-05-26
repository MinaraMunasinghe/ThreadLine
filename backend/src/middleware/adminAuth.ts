import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

export function adminAuth(req: Request, res: Response, next: NextFunction): void {
  const apiKey = req.header('x-admin-key');

  if (!apiKey || apiKey !== env.adminApiKey) {
    res.status(401).json({ message: 'Unauthorized — valid admin API key required' });
    return;
  }

  next();
}
