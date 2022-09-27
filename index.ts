import next from 'next';
import dotenv from 'dotenv';
// import enforce from 'express-sslify';
dotenv.config();

import express from 'express';
import cookieParser from 'cookie-parser';

import authRouter from './routes/auth';
import tweetsRouter from './routes/tweets';
import authMiddleware from './middlewares/auth';

const isDev = process.env.NODE_ENV !== 'production';
const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST;
const COOKIE_SECRET = process.env.COOKIE_SECRET;

// Next.js application handler
const app = next({ dev: isDev, hostname: HOST, port: PORT });
const appHandler = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Force https
  // server.use(enforce.HTTPS({ trustProtoHeader: true }));
  // Convert requests' body to json
  server.use(express.json());
  // Cookie secret
  server.use(cookieParser(COOKIE_SECRET));

  // Give all Next.js's requests to Next.js server
  if (appHandler) {
    server.get('/_next/*', (req, res) => {
      return appHandler(req, res);
    });
    server.get('/static/*', (req, res) => {
      return appHandler(req, res);
    });
  }

  // API routes
  server.use('/api/auth', authRouter);
  server.use('/api/tweets', authMiddleware, tweetsRouter);

  // Let next handle the default route
  if (appHandler) {
    server.get('*', (req, res) => {
      return appHandler(req, res);
    });
  }

  // Start server
  server.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
  });

  return server;
});
