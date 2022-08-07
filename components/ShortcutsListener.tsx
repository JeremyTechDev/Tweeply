import { FC } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import toast, { ToastOptions } from 'react-hot-toast';

import { SHORTCUT_KEYS, HOTKEY_OPTIONS } from '../helpers/contants';
import { postRequest } from '../helpers/fetch';

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
      postRequest(`/tweets/${tweetId}/like`)
        .then((res) => {
          if (res.status === 200) {
            toast.success('Tweet liked', TOAST_OPTIONS);
          } else {
            toast.error('Error linking the tweet', TOAST_OPTIONS);
          }
        })
        .catch(() => {
          toast.error('Ops, something went wrong', TOAST_OPTIONS);
        });
    },
    HOTKEY_OPTIONS,
  );
  useHotkeys(
    SHORTCUT_KEYS.reply,
    (e) => {
      e.preventDefault();
      postRequest(`/tweets/${tweetId}/conversation`, { replyContent: value })
        .then((res) => {
          if (res.status === 200) {
            toast.success('Reply sent', TOAST_OPTIONS);
          } else {
            toast.error('Error sending the reply', TOAST_OPTIONS);
          }
        })
        .catch(() => {
          toast.error('Ops, something went wrong', TOAST_OPTIONS);
        });
    },
    HOTKEY_OPTIONS,
  );
  useHotkeys(
    SHORTCUT_KEYS.replyAndLike,
    () => {
      const likePromise = postRequest(`/tweets/${tweetId}/like`);
      const replyPromise = postRequest(`/tweets/${tweetId}/conversation`, {
        replyContent: value,
      });

      Promise.allSettled([likePromise, replyPromise])
        .then((results) => {
          if (
            results[0].status === 'fulfilled' &&
            results[1].status === 'fulfilled'
          ) {
            if (
              results[0].value.status === 200 &&
              results[1].value.status === 200
            ) {
              toast.success('Liked & reply sent', TOAST_OPTIONS);
            } else {
              toast.error(
                'Ops, could not like or send the reply',
                TOAST_OPTIONS,
              );
            }
          } else {
            toast.error(
              'Ops, your request could not be fulfilled',
              TOAST_OPTIONS,
            );
          }
        })
        .catch(() => {
          toast.error(
            'Ops, something went wrong with the requests',
            TOAST_OPTIONS,
          );
        });
    },
    HOTKEY_OPTIONS,
  );
  useHotkeys(
    SHORTCUT_KEYS.retweet,
    (e) => {
      e.preventDefault();
      postRequest(`/tweets/${tweetId}/retweet`)
        .then((res) => {
          if (res.status === 200) {
            toast.success('Retweeted', TOAST_OPTIONS);
          } else {
            toast.error('Error sending the reply', TOAST_OPTIONS);
          }
        })
        .catch(() => {
          toast.error('Ops, something went wrong', TOAST_OPTIONS);
        });
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
