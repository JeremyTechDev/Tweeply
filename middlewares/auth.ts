import { RequestHandler } from 'express';

const TWITTER_API_KEY = process.env.TWITTER_API_KEY as string;
const TWITTER_API_SECRET = process.env.TWITTER_API_SECRET as string;

// Checks that auth token and tokenSecret at set, returns status code 401 otherwise
const authMiddleware: RequestHandler = (req, res, next) => {
  try {
    const { token, tokenSecret } = req.cookies.userData;

    if (!token || !tokenSecret) {
      return res.status(401).send({ error: 'Unauthorized' });
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
    return res.status(500).send({ error: error?.toString() });
  }
};

export default authMiddleware;
