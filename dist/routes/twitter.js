"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const twit_1 = __importDefault(require("twit"));
const TWITTER_API_KEY = process.env.TWITTER_API_KEY;
const TWITTER_API_SECRET = process.env.TWITTER_API_SECRET;
const router = express_1.default.Router();
router.get('/tweet', (req, res) => {
    try {
        const { userId, token, tokenSecret } = req.cookies.userData;
        const T = new twit_1.default({
            consumer_key: TWITTER_API_KEY,
            consumer_secret: TWITTER_API_SECRET,
            access_token: token,
            access_token_secret: tokenSecret,
        });
        console.log({
            consumer_key: TWITTER_API_KEY,
            consumer_secret: TWITTER_API_SECRET,
            access_token: token,
            access_token_secret: tokenSecret,
        });
        T.post('statuses/update', { status: 'If you see this tweet, a test I was doing worked! Twitter API is so coool!' }, (err, result, response) => {
            console.log(result, err);
        });
        res.send('yes');
    }
    catch (e) {
        return res.status(401);
    }
});
router.get('/like', (req, res) => {
    try {
        const { userId, token, tokenSecret } = req.cookies.userData;
        const T = new twit_1.default({
            consumer_key: TWITTER_API_KEY,
            consumer_secret: TWITTER_API_SECRET,
            access_token: token,
            access_token_secret: tokenSecret,
        });
        console.log({
            consumer_key: TWITTER_API_KEY,
            consumer_secret: TWITTER_API_SECRET,
            access_token: token,
            access_token_secret: tokenSecret,
        });
        T.post('favorites/create', { id: '1552021795544383490' }, (err, result, response) => {
            console.log(result, err);
        });
        res.send('yes');
        // const oauth = new OAuth({
        //   consumer: {
        //     key: TWITTER_API_KEY,
        //     secret: TWITTER_API_SECRET,
        //   },
        //   signature_method: 'HMAC-SHA1',
        //   hash_function: (baseString, key) => {
        //     return crypto
        //       .createHmac('sha1', key)
        //       .update(baseString)
        //       .digest('base64');
        //   },
        // });
        // const requestData: OAuth.RequestOptions = {
        //   url: `https://api.twitter.com/1.1/favorites/create.json?id=${1552002181821353985}`,
        //   method: 'POST',
        //   data: {
        //     // include_entities: 'true',
        //     // oauth_consumer_key: TWITTER_API_KEY,
        //     // oauth_consumer_secret: TWITTER_API_SECRET,
        //     oauth_consumer_key: token,
        //     oauth_consumer_secret: tokenSecret,
        //     oauth_token: TWITTER_API_KEY,
        //     oauth_token_secret: TWITTER_API_SECRET,
        //   },
        // };
        // console.log(oauth.toHeader(oauth.authorize(requestData)));
        // request.post(
        //   `https://api.twitter.com/1.1/favorites/create.json?id=${1552002181821353985}`,
        //   {
        //     headers: oauth.toHeader(oauth.authorize(requestData)),
        //     // body: JSON.stringify({
        //     //   tweet_id: '1552002181821353985',
        //     // }),
        //   },
        //   (err, response) => {
        //     console.log(response.statusCode);
        //     console.log(response.statusMessage);
        //     console.log(response.body);
        //     return res.send('it worked');
        //   },
        // );
        // res.send(req.cookies);
    }
    catch (e) {
        console.log('e');
        return res.status(401);
    }
});
exports.default = router;
