"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// @ts-ignore
const simple_get_1 = __importDefault(require("simple-get"));
const oauth_1_0a_1 = __importDefault(require("oauth-1.0a"));
const crypto_1 = __importDefault(require("crypto"));
const TWITTER_CALLBACK_URL = process.env.TWITTER_CALLBACK_URL;
const TWITTER_API_KEY = process.env.TWITTER_API_KEY;
const TWITTER_API_SECRET = process.env.TWITTER_API_SECRET;
const TWITTER_REQ_TOKEN_URL = 'https://api.twitter.com/oauth/request_token';
const TWITTER_AUTH_URL = 'https://api.twitter.com/oauth/authenticate';
const TWITTER_ACCESS_TOKEN_URL = 'https://api.twitter.com/oauth/access_token';
const router = express_1.default.Router();
const oauth = new oauth_1_0a_1.default({
    consumer: {
        key: TWITTER_API_KEY,
        secret: TWITTER_API_SECRET,
    },
    signature_method: 'HMAC-SHA1',
    hash_function: (baseString, key) => {
        return crypto_1.default.createHmac('sha1', key).update(baseString).digest('base64');
    },
});
router.get('/token', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { redirect } = req.query;
        const requestData = {
            url: TWITTER_REQ_TOKEN_URL,
            method: 'POST',
            data: {
                oauth_callback: TWITTER_CALLBACK_URL,
            },
        };
        simple_get_1.default.concat({
            url: requestData.url,
            method: requestData.method,
            form: requestData.data,
            headers: oauth.toHeader(oauth.authorize(requestData)),
        }, (err, _response, data) => {
            if (err)
                return res.status(400).send('Ops! something went wrong there');
            const urlResponse = new URLSearchParams(data.toString());
            const token = urlResponse.get('oauth_token');
            const tokenSecret = urlResponse.get('oauth_token_secret');
            const url = `${TWITTER_AUTH_URL}?oauth_token=${token}`;
            res.cookie('tokenSecret', tokenSecret);
            if (redirect) {
                return res.redirect(url);
            }
            res.send({ redirentUrl: url });
        });
    }
    catch (error) {
        return res.status(500).send({ error });
    }
}));
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
        simple_get_1.default.concat({
            url: requestData.url,
            method: requestData.method,
            form: requestData.data,
            headers: oauth.toHeader(oauth.authorize(requestData)),
        }, (err, _response, data) => {
            if (err)
                return res.status(400).send('Ops! something went wrong there');
            const urlResponse = new URLSearchParams(data.toString());
            const token = urlResponse.get('oauth_token');
            const tokenSecret = urlResponse.get('oauth_token_secret');
            const screenName = urlResponse.get('screen_name');
            const userId = urlResponse.get('user_id');
            const userData = { screenName, userId, token, tokenSecret };
            res.cookie('userData', userData);
            return res.redirect('/');
        });
    }
    catch (error) {
        return res.status(500).send({ error });
    }
});
router.post('/logout', (req, res) => {
    res.clearCookie('userData');
    res.clearCookie('tokenSecret');
    return res.status(204).send({ message: 'Logout successful' });
});
exports.default = router;
