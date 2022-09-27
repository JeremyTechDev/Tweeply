import express from 'express';
import request from 'request';
import Twit from 'twit';

import {
  EXPANSIONS,
  TWEETS_REQUIRED_FIELDS,
  USER_REQUIRED_FIELDS,
  TWITTER_V2_API_ROUTE,
} from '../helpers/contants';
import { STATUS_CODES } from '../helpers/contants';

const router = express.Router();

/**
 * Get list of recent tweets
 * @param withReplies Add '1' to include replies to the tweet
 * @param limit Number of tweets to return (10-100)
 */
router.get('/', (req, res) => {
  try {
    const { screenName } = req.cookies.userData;
    const { withReplies, limit = 100 } = req.query;

    request.get(
      `${TWITTER_V2_API_ROUTE}/tweets/search/recent?query=(from:${screenName}${
        withReplies === '1' ? '' : ' -is:reply'
      })&${TWEETS_REQUIRED_FIELDS}&${USER_REQUIRED_FIELDS}&${EXPANSIONS}&max_results=${limit}`,
      {
        headers: { Authorization: `Bearer ${process.env.TWITTER_API_BEARER}` },
      },
      (_, response, body) => {
        if (response.statusCode !== STATUS_CODES.OK) {
          return res.status(STATUS_CODES.BAD_REQUEST).send(body);
        }

        return res.send(body);
      },
    );
  } catch (error) {
    return res.status(STATUS_CODES.SERVER_ERROR).send({ error });
  }
});

/**
 * Get single tweet by tweet id
 * @param {required} tweetId The tweet Id
 */
router.get('/:tweetId', (req, res) => {
  try {
    const { tweetId } = req.params;

    if (!tweetId) {
      res
        .status(STATUS_CODES.BAD_REQUEST)
        .send({ error: 'No `tweetId` was sent' });
    }

    request.get(
      `${TWITTER_V2_API_ROUTE}/tweets/${tweetId}/?${TWEETS_REQUIRED_FIELDS}&${USER_REQUIRED_FIELDS}&${EXPANSIONS}`,
      {
        headers: { Authorization: `Bearer ${process.env.TWITTER_API_BEARER}` },
      },
      (_, response, body) => {
        if (response.statusCode !== STATUS_CODES.OK) {
          return res.status(STATUS_CODES.BAD_REQUEST).send(body);
        }

        return res.send(body);
      },
    );
  } catch (error) {
    return res.status(STATUS_CODES.SERVER_ERROR).send({ error });
  }
});

/**
 * Get list of replies of a single tweet by Id
 * @param {required} tweetId The tweet Id
 * @param sinceId The starting tweet to add results from
 */
router.get('/:tweetId/conversation', (req, res) => {
  try {
    const { tweetId } = req.params;
    const { sinceId } = req.query;

    if (!tweetId) {
      res
        .status(STATUS_CODES.BAD_REQUEST)
        .send({ error: 'No `tweetId` was sent' });
    }

    const sinceIdParam = sinceId ? `&since_id=${sinceId}` : '';

    request.get(
      `${TWITTER_V2_API_ROUTE}/tweets/search/recent?query=conversation_id:${tweetId}&${TWEETS_REQUIRED_FIELDS}&${USER_REQUIRED_FIELDS}&${EXPANSIONS}${sinceIdParam}`,
      {
        headers: { Authorization: `Bearer ${process.env.TWITTER_API_BEARER}` },
      },
      (err, response, body) => {
        if (response.statusCode !== STATUS_CODES.OK) {
          res.status(STATUS_CODES.BAD_REQUEST).send({ error: err, data: body });
        }

        res.send(body);
      },
    );
  } catch (error) {
    return res.status(STATUS_CODES.SERVER_ERROR).send({ error });
  }
});

/**
 * Post a new reply to a Tweet by Id
 * @param {required} tweetId The tweet Id
 * @param {required} replyContent The content of the reply
 */
router.post('/:tweetId/conversation', (req, res) => {
  try {
    const { tweetId } = req.params;
    const { replyContent } = req.body;

    if (!tweetId || !replyContent) {
      return res
        .status(400)
        .send({ error: 'No `tweetId` or `replyContent` was sent' });
    }

    const authData = res.locals.authData as Twit.Options;
    const T = new Twit(authData);

    T.post(
      'statuses/update',
      {
        status: replyContent,
        in_reply_to_status_id: tweetId,
        auto_populate_reply_metadata: true,
      },
      (_, body, response) => {
        if (response.statusCode !== STATUS_CODES.OK) {
          return res.status(STATUS_CODES.BAD_REQUEST).send(body);
        }

        return res.send(body);
      },
    );
  } catch (error) {
    return res.status(STATUS_CODES.SERVER_ERROR).send({ error });
  }
});

/**
 * Like a tweet by Id
 * @param {required} tweetId The tweet Id
 */
router.post('/:tweetId/like', (req, res) => {
  try {
    const { tweetId } = req.params;

    if (!tweetId) {
      res.status(STATUS_CODES.BAD_REQUEST).send('No `tweetId` was sent');
    }

    const authData = res.locals.authData as Twit.Options;
    const T = new Twit(authData);

    T.post('favorites/create', { id: tweetId }, (_, body, response) => {
      if (
        response.statusCode !== STATUS_CODES.OK &&
        response.statusCode !== 403
      ) {
        // 403 is already liked
        return res.status(STATUS_CODES.BAD_REQUEST).send(body);
      }

      return res.send(body);
    });
  } catch (error) {
    return res.status(STATUS_CODES.SERVER_ERROR).send({ error });
  }
});

/**
 * Dislike a tweet by Id
 * @param {required} tweetId The tweet Id
 */
router.delete('/:tweetId/like', (req, res) => {
  try {
    const { tweetId } = req.params;

    if (!tweetId) {
      res.status(STATUS_CODES.BAD_REQUEST).send('No `tweetId` was sent');
    }

    const authData = res.locals.authData as Twit.Options;
    const T = new Twit(authData);

    T.post('favorites/destroy', { id: tweetId }, (_, body, response) => {
      if (response.statusCode !== STATUS_CODES.OK) {
        return res.status(STATUS_CODES.BAD_REQUEST).send(body);
      }

      return res.send(body);
    });
  } catch (error) {
    return res.status(STATUS_CODES.SERVER_ERROR).send({ error });
  }
});

/**
 * Retweet a tweet by Id
 * @param {required} tweetId The tweet Id
 */
router.post('/:tweetId/retweet', (req, res) => {
  try {
    const { tweetId } = req.params;

    if (!tweetId) {
      res.status(STATUS_CODES.BAD_REQUEST).send('No `tweetId` was sent');
    }

    const authData = res.locals.authData as Twit.Options;
    const T = new Twit(authData);

    T.post('statuses/retweet', { id: tweetId }, (_, body, response) => {
      if (response.statusCode !== STATUS_CODES.OK) {
        return res.status(STATUS_CODES.BAD_REQUEST).send(body);
      }

      return res.send(body);
    });
  } catch (error) {
    return res.status(STATUS_CODES.SERVER_ERROR).send({ error });
  }
});

export default router;
