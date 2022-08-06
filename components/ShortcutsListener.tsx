import { FC } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import toast, { ToastOptions } from 'react-hot-toast';

import { SHORTCUT_KEYS, HOTKEY_OPTIONS } from '../helpers/contants';

interface T {
  tweetId: string;
  value?: string;
}

const TOAST_OPTIONS: ToastOptions = {
  duration: 2000,
  position: 'bottom-right',
  style: {
    borderRadius: '10px',
    background: '#333',
    color: '#fff',
  },
};

const ShortcutsListener: FC<T> = ({ value, tweetId }) => {
  useHotkeys(
    SHORTCUT_KEYS.like,
    (e) => {
      e.preventDefault();
      toast.success('Tweet liked', TOAST_OPTIONS);
    },
    HOTKEY_OPTIONS,
  );
  useHotkeys(
    SHORTCUT_KEYS.reply,
    () => {
      toast.success('Reply sent', TOAST_OPTIONS);
    },
    HOTKEY_OPTIONS,
  );
  useHotkeys(
    SHORTCUT_KEYS.replyAndLike,
    () => {
      toast.success('Tweet liked & reply sent', TOAST_OPTIONS);
    },
    HOTKEY_OPTIONS,
  );
  useHotkeys(
    SHORTCUT_KEYS.retweet,
    (e) => {
      e.preventDefault();
      toast.success('Retweeted', TOAST_OPTIONS);
    },
    HOTKEY_OPTIONS,
  );
  // useHotkeys(
  //   SHORTCUT_KEYS.quote,
  //   (e) => {
  //     e.preventDefault();
  //   },
  //   HOTKEY_OPTIONS,
  // );
  // useHotkeys(
  //   SHORTCUT_KEYS.skip,
  //   () => {
  //   },
  //   HOTKEY_OPTIONS,
  // );

  return null;
};

export default ShortcutsListener;
