"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const request_1 = __importDefault(require("request"));
const twit_1 = __importDefault(require("twit"));
const contants_1 = require("../helpers/contants");
const router = express_1.default.Router();
// Get list of recent tweets
router.get('/', (req, res) => {
    try {
        const { screenName } = req.cookies.userData;
        const { withReplies, limit = 100 } = req.query;
        request_1.default.get(`https://api.twitter.com/2/tweets/search/recent?query=(from:${screenName}${withReplies === '1' ? '' : ' -is:reply'})&${contants_1.TWEETS_REQUIRED_FIELDS}&${contants_1.USER_REQUIRED_FIELDS}&${contants_1.EXPANSIONS}&max_results=${limit}`, {
            headers: { Authorization: `Bearer ${process.env.TWITTER_API_BEARER}` },
        }, (_, response, body) => {
            if (response.statusCode !== 200) {
                return res.status(400).send(body);
            }
            return res.send(body);
        });
    }
    catch (error) {
        return res.status(500).send({ error });
    }
});
// Get tweet by Id
router.get('/:tweetId', (req, res) => {
    try {
        const { tweetId } = req.params;
        if (!tweetId) {
            res.status(400).send({ error: 'No `tweetId` was sent' });
        }
        request_1.default.get(`https://api.twitter.com/2/tweets/${tweetId}/?${contants_1.TWEETS_REQUIRED_FIELDS}&${contants_1.USER_REQUIRED_FIELDS}&${contants_1.EXPANSIONS}`, {
            headers: { Authorization: `Bearer ${process.env.TWITTER_API_BEARER}` },
        }, (_, response, body) => {
            if (response.statusCode !== 200) {
                return res.status(400).send(body);
            }
            return res.send(body);
        });
    }
    catch (error) {
        return res.status(500).send({ error });
    }
});
// Get replies of a tweet by its Id
router.get('/:tweetId/conversation', (req, res) => {
    try {
        const { tweetId } = req.params;
        const { sinceId } = req.query;
        if (!tweetId) {
            res.status(400).send({ error: 'No `tweetId` was sent' });
        }
        const sinceIdParam = sinceId ? `&since_id=${sinceId}` : '';
        request_1.default.get(`https://api.twitter.com/2/tweets/search/recent?query=conversation_id:${tweetId}&${contants_1.TWEETS_REQUIRED_FIELDS}&${contants_1.USER_REQUIRED_FIELDS}&${contants_1.EXPANSIONS}${sinceIdParam}`, {
            headers: { Authorization: `Bearer ${process.env.TWITTER_API_BEARER}` },
        }, (err, response, body) => {
            if (response.statusCode !== 200) {
                res.status(400).send({ error: err, data: body });
            }
            res.send(body);
        });
    }
    catch (error) {
        return res.status(500).send({ error });
    }
});
// Add reply on conversation with :tweetId
router.post('/:tweetId/conversation', (req, res) => {
    try {
        const { tweetId } = req.params;
        const { replyContent } = req.body;
        if (!tweetId || !replyContent) {
            return res
                .status(400)
                .send({ error: 'No `tweetId` or `replyContent` was sent' });
        }
        const authData = res.locals.authData;
        const T = new twit_1.default(authData);
        T.post('statuses/update', {
            status: replyContent,
            in_reply_to_status_id: tweetId,
            auto_populate_reply_metadata: true,
        }, (_, body, response) => {
            if (response.statusCode !== 200) {
                return res.status(400).send(body);
            }
            return res.send(body);
        });
    }
    catch (error) {
        return res.status(500).send({ error });
    }
});
// Like a tweet
router.post('/:tweetId/like', (req, res) => {
    try {
        const { tweetId } = req.params;
        if (!tweetId) {
            res.status(400).send('No `tweetId` was sent');
        }
        const authData = res.locals.authData;
        const T = new twit_1.default(authData);
        T.post('favorites/create', { id: tweetId }, (_, body, response) => {
            if (response.statusCode !== 200 && response.statusCode !== 403) {
                // 403 is already liked
                return res.status(400).send(body);
            }
            return res.send(body);
        });
    }
    catch (error) {
        return res.status(500).send({ error });
    }
});
// Dislike a tweet
router.delete('/:tweetId/like', (req, res) => {
    try {
        const { tweetId } = req.params;
        if (!tweetId) {
            res.status(400).send('No `tweetId` was sent');
        }
        const authData = res.locals.authData;
        const T = new twit_1.default(authData);
        T.post('favorites/destroy', { id: tweetId }, (_, body, response) => {
            if (response.statusCode !== 200) {
                return res.status(400).send(body);
            }
            return res.send(body);
        });
    }
    catch (error) {
        return res.status(500).send({ error });
    }
});
// Retweet a tweet
router.post('/:tweetId/retweet', (req, res) => {
    try {
        const { tweetId } = req.params;
        if (!tweetId) {
            res.status(400).send('No `tweetId` was sent');
        }
        const authData = res.locals.authData;
        const T = new twit_1.default(authData);
        T.post('statuses/retweet', { id: tweetId }, (_, body, response) => {
            if (response.statusCode !== 200) {
                return res.status(400).send(body);
            }
            return res.send(body);
        });
    }
    catch (error) {
        return res.status(500).send({ error });
    }
});
exports.default = router;
