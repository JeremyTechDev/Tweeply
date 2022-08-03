import { Options } from 'react-hotkeys-hook';

export const TWEETS_REQUIRED_FIELDS =
  'tweet.fields=id,created_at,text,attachments,entities,public_metrics';
export const USER_REQUIRED_FIELDS =
  'expansions=author_id&user.fields=id,name,profile_image_url,username,url';

export const HOTKEY_OPTIONS: Options = { enableOnTags: ['TEXTAREA'] };

export const SHORTCUTS = [
  {
    keys: 'cmd+shift+l',
    displayKeys: '⌘ + Shift + L',
    label: 'Like',
  },
  {
    keys: 'cmd+enter',
    displayKeys: '⌘ + Enter',
    label: 'Reply',
  },
  {
    keys: 'cmd+shift+enter',
    displayKeys: '⌘ + Shift + Enter',
    label: 'Reply & Like',
  },
  {
    keys: 'cmd+shift+r',
    displayKeys: '⌘ + Shift + R',
    label: 'Retweet',
  },
  {
    keys: 'cmd+shift+u',
    displayKeys: '⌘ + Shift + U',
    label: 'Quote Retweet',
  },
  {
    keys: 'cmd+k',
    displayKeys: '⌘ + K',
    label: 'Skip',
  },
];

export const SHORTCUT_KEYS = {
  like: SHORTCUTS[0].keys,
  reply: SHORTCUTS[1].keys,
  replyAndLike: SHORTCUTS[2].keys,
  retweet: SHORTCUTS[3].keys,
  quote: SHORTCUTS[4].keys,
  skip: SHORTCUTS[5].keys,
};
