import { RequestHandler } from 'express';
import { STATUS_CODES } from '../helpers/contants';

const TWITTER_API_KEY = process.env.TWITTER_API_KEY as string;
const TWITTER_API_SECRET = process.env.TWITTER_API_SECRET as string;

// Checks that auth token and tokenSecret at set, redirect to authenticate
const authMiddleware: RequestHandler = (req, res, next) => {
  try {
    const { token, tokenSecret } = req?.cookies?.userData || {};

    if (!token || !tokenSecret) {
      return res
        .status(STATUS_CODES.NOT_AUTHORIZED)
        .send({ error: 'Not Authorized' });
    }

    const authData = {
      access_token: token,
      access_token_secret: tokenSecret,
      consumer_key: TWITTER_API_KEY,
      consumer_secret: TWITTER_API_SECRET,
    };

    res.locals.authData = authData;
    next();
  } catch (error) {
    return res.status(STATUS_CODES.SERVER_ERROR).send({ error });
  }
};

export default authMiddleware;
