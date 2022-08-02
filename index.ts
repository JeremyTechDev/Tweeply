import next from 'next';
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cookieParser from 'cookie-parser';

import authRouter from './routes/auth';
import tweetsRouter from './routes/tweets';
import authMiddleware from './middlewares/auth';

const isDev = process.env.NODE_ENV !== 'production';
const PORT = Number(process.env.PORT) || 3000;
const HOSTNAME = process.env.HOSTNAME || 'localhost';
const COOKIE_SECRET = process.env.COOKIE_SECRET;

const app = next({ dev: isDev, hostname: HOSTNAME, port: PORT });
const appHandler = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.use(express.json());
  server.use(cookieParser(COOKIE_SECRET));

  // give all Next.js's requests to Next.js server
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

  // let next handle the default route
  if (appHandler) {
    server.get('*', (req, res) => {
      return appHandler(req, res);
    });
  }

  server.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
  });

  return server;
});
