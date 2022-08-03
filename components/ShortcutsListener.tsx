import { FC } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

import { SHORTCUT_KEYS, HOTKEY_OPTIONS } from '../helpers/contants';

interface T {
  tweetId: string;
  value?: string;
}

const ShortcutsListener: FC<T> = ({ value, tweetId }) => {
  useHotkeys(
    SHORTCUT_KEYS.like,
    () => console.log('LIKE', tweetId, value),
    HOTKEY_OPTIONS,
  );
  useHotkeys(
    SHORTCUT_KEYS.reply,
    () => console.log('REPLY', tweetId, value),
    HOTKEY_OPTIONS,
  );
  useHotkeys(
    SHORTCUT_KEYS.replyAndLike,
    () => console.log('REPLY & LIKE', tweetId, value),
    HOTKEY_OPTIONS,
  );
  useHotkeys(
    SHORTCUT_KEYS.retweet,
    (e) => {
      e.preventDefault();
      console.log('RETWEET', tweetId, value);
    },
    HOTKEY_OPTIONS,
  );
  useHotkeys(
    SHORTCUT_KEYS.quote,
    (e) => {
      e.preventDefault();
      console.log('QUOTE', tweetId, value);
    },
    HOTKEY_OPTIONS,
  );
  useHotkeys(
    SHORTCUT_KEYS.skip,
    () => console.log('SKIP', tweetId, value),
    HOTKEY_OPTIONS,
  );

  return null;
};

export default ShortcutsListener;
