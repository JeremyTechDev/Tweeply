import { Options } from 'react-hotkeys-hook';

export const TWITTER_V2_API_ROUTE = 'https://api.twitter.com/2';

export const EXPANSIONS =
  'expansions=author_id,referenced_tweets.id,attachments.media_keys';
export const TWEETS_REQUIRED_FIELDS =
  'tweet.fields=id,created_at,text,attachments,entities,public_metrics,referenced_tweets&media.fields=preview_image_url,url,alt_text';
export const USER_REQUIRED_FIELDS =
  'user.fields=id,name,profile_image_url,username,url';

export const HOTKEY_OPTIONS: Options = { enableOnTags: ['TEXTAREA'] };

export const SHORTCUTS = [
  {
    keys: 'cmd+shift+l, ctrl+shift+l',
    displayKeys: '⌘/ctrl + Shift + L',
    label: 'Like',
  },
  {
    keys: 'cmd+enter, ctrl+enter',
    displayKeys: '⌘/ctrl + Enter',
    label: 'Reply',
  },
  {
    keys: 'cmd+shift+enter, ctrl+shift+enter',
    displayKeys: '⌘/ctrl + Shift + Enter',
    label: 'Reply & Like',
  },
  {
    keys: 'cmd+shift+r, ctrl+shift+r',
    displayKeys: '⌘/ctrl + Shift + R',
    label: 'Retweet',
  },
  // {
  //   keys: 'cmd+shift+u',
  //   displayKeys: '⌘/ctrl + Shift + U',
  //   label: 'Quote Retweet',
  // },
  // {
  //   keys: 'cmd+k',
  //   displayKeys: '⌘/ctrl + K',
  //   label: 'Skip',
  // },
];

export const SHORTCUT_KEYS = {
  like: SHORTCUTS[0].keys,
  reply: SHORTCUTS[1].keys,
  replyAndLike: SHORTCUTS[2].keys,
  retweet: SHORTCUTS[3].keys,
  // quote: SHORTCUTS[4].keys,
  // skip: SHORTCUTS[5].keys,
};
