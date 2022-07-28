import express from 'express';
import Twit from 'twit';

const router = express.Router();

// Get list of recent tweets
router.get('/', (req, res, next) => {
  try {
    const { screenName } = req.cookies.userData;
    const { withReplies, limit = 100 } = req.query;

    const authData = res.locals.authData as Twit.Options;
    const T = new Twit(authData);

    console.log(T.getAuth());

    T.get(
      'search/tweets',
      {
        q: `(from:${screenName}) ${
          withReplies === '1' ? '' : '-filter:replies'
        }`,
        tweet_mode: 'extended',
        count: Number(limit),
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

// Get tweet by Id
router.get('/:tweetId', (req, res) => {
  try {
    const { tweetId } = req.params;

    const authData = res.locals.authData as Twit.Options;
    const T = new Twit(authData);

    if (!tweetId) {
      res.status(400).send('No `tweetId` was sent');
    }

    T.get(
      'statuses/show',
      {
        id: tweetId,
        tweet_mode: 'extended',
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
router.get('/:tweetId/replies', (req, res) => {
  try {
    const { tweetId } = req.params;
    const { limit = 100 } = req.query;
    const { screenName } = req.cookies.userData;

    const authData = res.locals.authData as Twit.Options;
    const T = new Twit(authData);

    if (!tweetId) {
      res.status(400).send('No `tweetId` was sent');
    }

    T.get(
      'search/tweets',
      {
        q: `(to:${screenName})`,
        since_id: tweetId,
        tweet_mode: 'extended',
        count: Number(limit),
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
