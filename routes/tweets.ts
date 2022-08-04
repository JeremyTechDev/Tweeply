import express from 'express';
import request from 'request';
import Twit from 'twit';

import {
  TWEETS_REQUIRED_FIELDS,
  USER_REQUIRED_FIELDS,
} from '../helpers/contants';

const router = express.Router();

// Get list of recent tweets
router.get('/', (req, res) => {
  try {
    const { screenName } = req.cookies.userData;
    const { withReplies, limit = 100 } = req.query;

    request.get(
      `https://api.twitter.com/2/tweets/search/recent?query=(from:${screenName}${
        withReplies === '1' ? '' : ' -is:reply'
      })&${TWEETS_REQUIRED_FIELDS}&${USER_REQUIRED_FIELDS}&max_results=${limit}`,
      {
        headers: { Authorization: `Bearer ${process.env.TWITTER_API_BEARER}` },
      },
      (err, _, body) => {
        if (err) {
          res.status(400).send(err);
        }

        res.send(body);
      },
    );
  } catch (error) {
    return res.status(500).send({ error: error?.toString() });
  }
});

// Get tweet by Id
router.get('/:tweetId', (req, res) => {
  try {
    const { tweetId } = req.params;

    request.get(
      `https://api.twitter.com/2/tweets/${tweetId}/?${TWEETS_REQUIRED_FIELDS}&${USER_REQUIRED_FIELDS}`,
      {
        headers: { Authorization: `Bearer ${process.env.TWITTER_API_BEARER}` },
      },
      (err, _, body) => {
        if (err) {
          res.status(400).send(err);
        }

        res.send(body);
      },
    );
  } catch (error) {
    return res.status(500).send({ error: error?.toString() });
  }
});

// Delete tweet by id
router.delete('/:tweetId', (req, res) => {
  try {
    const { tweetId } = req.params;

    const authData = res.locals.authData as Twit.Options;
    const T = new Twit(authData);

    if (!tweetId) {
      res.status(400).send('No `tweetId` was sent');
    }

    T.post(
      'statuses/destroy',
      {
        id: tweetId,
      },
      (err, result) => {
        if (err) {
          res.status(400).send(err);
        }

        res.send(result);
      },
    );
  } catch (error) {
    return res.status(500).send({ error: error?.toString() });
  }
});

// Get replies of a tweet by its Id
router.get('/:tweetId/conversation', (req, res) => {
  try {
    const { tweetId } = req.params;

    if (!tweetId) {
      res.status(400).send('No `tweetId` was sent');
    }

    request.get(
      `https://api.twitter.com/2/tweets/search/recent?query=conversation_id:${tweetId}&${TWEETS_REQUIRED_FIELDS}&${USER_REQUIRED_FIELDS}`,
      {
        headers: { Authorization: `Bearer ${process.env.TWITTER_API_BEARER}` },
      },
      (err, response, body) => {
        if (err) {
          res.status(400).send(err);
        }

        res.send(body);
      },
    );
  } catch (error) {
    return res.status(500).send({ error: error?.toString() });
  }
});

router.post('/:tweetId/replies', (req, res) => {
  try {
    const { tweetId } = req.params;
    const { replyContent } = req.body;

    const authData = res.locals.authData as Twit.Options;
    const T = new Twit(authData);

    if (!tweetId || !replyContent) {
      res.status(400).send('No `tweetId` or `replyContent` was sent');
    }

    T.post(
      'statuses/update',
      {
        status: replyContent,
        in_reply_to_status_id: tweetId,
        auto_populate_reply_metadata: true,
      },
      (err, result) => {
        if (err) {
          res.status(400).send(err);
        }

        res.send(result);
      },
    );
  } catch (error) {
    return res.status(500).send({ error: error?.toString() });
  }
});

// Like a tweet
router.post('/:tweetId/like', (req, res) => {
  try {
    const { tweetId } = req.params;

    const authData = res.locals.authData as Twit.Options;
    const T = new Twit(authData);

    if (!tweetId) {
      res.status(400).send('No `tweetId` was sent');
    }

    T.post('favorites/create', { id: tweetId }, (err, result) => {
      if (err) {
        res.status(400).send(err);
      }

      res.send(result);
    });
  } catch (error) {
    return res.status(500).send({ error: error?.toString() });
  }
});

// Dislike a tweet
router.delete('/:tweetId/like', (req, res) => {
  try {
    const { tweetId } = req.params;

    const authData = res.locals.authData as Twit.Options;
    const T = new Twit(authData);

    if (!tweetId) {
      res.status(400).send('No `tweetId` was sent');
    }

    T.post('favorites/destroy', { id: tweetId }, (err, result) => {
      if (err) {
        res.status(400).send(err);
      }

      res.send(result);
    });
  } catch (error) {
    return res.status(500).send({ error: error?.toString() });
  }
});

export default router;
