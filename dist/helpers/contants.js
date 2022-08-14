"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SHORTCUT_KEYS = exports.SHORTCUTS = exports.HOTKEY_OPTIONS = exports.USER_REQUIRED_FIELDS = exports.TWEETS_REQUIRED_FIELDS = exports.EXPANSIONS = void 0;
exports.EXPANSIONS = 'expansions=author_id,referenced_tweets.id,attachments.media_keys';
exports.TWEETS_REQUIRED_FIELDS = 'tweet.fields=id,created_at,text,attachments,entities,public_metrics,referenced_tweets&media.fields=preview_image_url,url,alt_text';
exports.USER_REQUIRED_FIELDS = 'user.fields=id,name,profile_image_url,username,url';
exports.HOTKEY_OPTIONS = { enableOnTags: ['TEXTAREA'] };
exports.SHORTCUTS = [
    {
        keys: 'cmd+shift+l, ctrl+shift+l',
        displayKeys: '⌘ + Shift + L',
        label: 'Like',
    },
    {
        keys: 'cmd+enter, ctrl+enter',
        displayKeys: '⌘ + Enter',
        label: 'Reply',
    },
    {
        keys: 'cmd+shift+enter, ctrl+shift+enter',
        displayKeys: '⌘ + Shift + Enter',
        label: 'Reply & Like',
    },
    {
        keys: 'cmd+shift+r, ctrl+shift+r',
        displayKeys: '⌘ + Shift + R',
        label: 'Retweet',
    },
    // {
    //   keys: 'cmd+shift+u',
    //   displayKeys: '⌘ + Shift + U',
    //   label: 'Quote Retweet',
    // },
    // {
    //   keys: 'cmd+k',
    //   displayKeys: '⌘ + K',
    //   label: 'Skip',
    // },
];
exports.SHORTCUT_KEYS = {
    like: exports.SHORTCUTS[0].keys,
    reply: exports.SHORTCUTS[1].keys,
    replyAndLike: exports.SHORTCUTS[2].keys,
    retweet: exports.SHORTCUTS[3].keys,
    // quote: SHORTCUTS[4].keys,
    // skip: SHORTCUTS[5].keys,
};
