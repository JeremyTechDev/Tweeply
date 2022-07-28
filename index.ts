import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cookieParser from 'cookie-parser';

import authRouter from './routes/auth';
import tweetsRouter from './routes/tweets';
import authMiddleware from './middlewares/auth';

const PORT = process.env.PORT || '3000';
const COOKIE_SECRET = process.env.COOKIE_SECRET;

const app = express();
app.use(express.json());
app.use(cookieParser(COOKIE_SECRET));

app.use('/api/auth', authRouter);
app.use('/api/tweets', authMiddleware, tweetsRouter);

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
