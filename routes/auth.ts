import express from 'express';
// @ts-ignore
import get from 'simple-get';
import OAuth from 'oauth-1.0a';
import crypto from 'crypto';

const TWITTER_CALLBACK_URL = process.env.TWITTER_CALLBACK_URL as string;
const TWITTER_API_KEY = process.env.TWITTER_API_KEY as string;
const TWITTER_API_SECRET = process.env.TWITTER_API_SECRET as string;

const TWITTER_REQ_TOKEN_URL = 'https://api.twitter.com/oauth/request_token';
const TWITTER_AUTH_URL = 'https://api.twitter.com/oauth/authenticate';
const TWITTER_ACCESS_TOKEN_URL = 'https://api.twitter.com/oauth/access_token';

const router = express.Router();

// Create Twitter OAuth request token
const oauth = new OAuth({
  consumer: {
    key: TWITTER_API_KEY,
    secret: TWITTER_API_SECRET,
  },
  signature_method: 'HMAC-SHA1',
  hash_function: (baseString, key) => {
    return crypto.createHmac('sha1', key).update(baseString).digest('base64');
  },
});

/**
 * Request a new Twitter Token to log in
 * @param {required} redirect Whether to automatically redirect to the Twitter Access page or not, any value will be true
 */
router.get('/token', async (req, res) => {
  try {
    const { redirect } = req.query;

    if (!redirect) {
      return res.status(400).send('`redirect` is missing');
    }

    const requestData = {
      url: TWITTER_REQ_TOKEN_URL,
      method: 'POST',
      data: {
        oauth_callback: TWITTER_CALLBACK_URL,
      },
    };

    get.concat(
      {
        url: requestData.url,
        method: requestData.method,
        form: requestData.data,
        headers: oauth.toHeader(oauth.authorize(requestData)),
      },
      (err: object | null, _response: unknown, data: object) => {
        if (err) return res.status(400).send('Ops! something went wrong there');

        const urlResponse = new URLSearchParams(data.toString());
        const token = urlResponse.get('oauth_token');
        const tokenSecret = urlResponse.get('oauth_token_secret');

        const url = `${TWITTER_AUTH_URL}?oauth_token=${token}`;

        res.cookie('tokenSecret', tokenSecret);
        if (redirect) {
          return res.redirect(url);
        }
        res.send({ redirectUrl: url });
      },
    );
  } catch (error) {
    return res.status(500).send({ error });
  }
});

/**
 * Url Twitter will redirect to after auth success.
 * Gets user data and redirect to App's homepage
 */
router.get('/twitter-callback', (req, res) => {
  try {
    const { oauth_token, oauth_verifier } = req.query;
    const { tokenSecret } = req.cookies;

    if (!oauth_token || !oauth_verifier || !tokenSecret) {
      return res.send(401);
    }

    const requestData = {
      url: TWITTER_ACCESS_TOKEN_URL,
      method: 'POST',
      data: {
        oauth_token,
        oauth_verifier,
        oauth_token_secret: tokenSecret,
      },
    };

    get.concat(
      {
        url: requestData.url,
        method: requestData.method,
        form: requestData.data,
        headers: oauth.toHeader(oauth.authorize(requestData)),
      },
      (err: object | null, _response: unknown, data: object) => {
        if (err) return res.status(400).send('Ops! something went wrong there');

        const urlResponse = new URLSearchParams(data.toString());
        const token = urlResponse.get('oauth_token');
        const tokenSecret = urlResponse.get('oauth_token_secret');
        const screenName = urlResponse.get('screen_name');
        const userId = urlResponse.get('user_id');

        const userData = { screenName, userId, token, tokenSecret };
        res.cookie('userData', userData);

        return res.redirect('/home');
      },
    );
  } catch (error) {
    return res.status(500).send({ error });
  }
});

/**
 * Removes auth token and to logout
 */
router.post('/logout', (req, res) => {
  res.clearCookie('userData');
  res.clearCookie('tokenSecret');
  return res.status(204).send({ message: 'Logout successful' });
});

export default router;
