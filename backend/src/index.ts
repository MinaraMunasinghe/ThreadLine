import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']); // Forces use of Google DNS
import app from './app';
import { env } from './config/env';
import { connectDatabase } from './config/db';

async function bootstrap(): Promise<void> {
  await connectDatabase();

  app.listen(env.port, () => {
    console.log(`ThreadLine API running on http://localhost:${env.port}`);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
