"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TWITTER_API_KEY = process.env.TWITTER_API_KEY;
const TWITTER_API_SECRET = process.env.TWITTER_API_SECRET;
// Checks that auth token and tokenSecret at set, redirect to authenticate
const authMiddleware = (req, res, next) => {
    var _a;
    try {
        const { token, tokenSecret } = ((_a = req === null || req === void 0 ? void 0 : req.cookies) === null || _a === void 0 ? void 0 : _a.userData) || {};
        if (!token || !tokenSecret) {
            return res.status(401).send({ error: 'Not Authorized' });
        }
        const authData = {
            access_token: token,
            access_token_secret: tokenSecret,
            consumer_key: TWITTER_API_KEY,
            consumer_secret: TWITTER_API_SECRET,
        };
        res.locals.authData = authData;
        next();
    }
    catch (error) {
        return res.status(500).send({ error });
    }
};
exports.default = authMiddleware;
