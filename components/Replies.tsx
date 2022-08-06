import React, { FC, useEffect, useMemo, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

import { ConversationResponse, iTweet, iUser } from '../@types';
import { HOTKEY_OPTIONS } from '../helpers/contants';
import Alert from './Alert';
import ReplyingTo from './ReplyingTo';
import ReplyTextArea from './ReplyTextArea';
import Tweet from './Tweet';

interface T {
  selectedTweetId: string | null;
  isActive: boolean;
}

const Replies: FC<T> = ({ selectedTweetId, isActive }) => {
  const [replies, setReplies] = useState<ConversationResponse>();
  const [selectedReplyIndex, setSelectedReplyIndex] = useState<number>(0);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useHotkeys(
    'up',
    () => {
      if (isActive) {
        setSelectedReplyIndex((prev) => {
          if (prev > 0) {
            return prev - 1;
          }
          return 0;
        });
      }
    },
    HOTKEY_OPTIONS,
    [isActive],
  );
  useHotkeys(
    'down',
    () => {
      if (isActive) {
        setSelectedReplyIndex((prev) => {
          const maxIndex = replies?.meta?.result_count as number;
          if (prev < maxIndex - 1) {
            return prev + 1;
          }
          return maxIndex - 1;
        });
      }
    },
    HOTKEY_OPTIONS,
    [isActive, replies?.meta?.result_count],
  );

  useEffect(() => {
    setIsLoading(true);
    setIsError(false);

    if (!selectedTweetId) {
      setIsError(true);
      return;
    }

    fetch(`http://localhost:3000/api/tweets/${selectedTweetId}/conversation`)
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        }
        throw Error;
      })
      .then((replies) => {
        setReplies(replies);
      })
      .catch(() => {
        setIsError(true);
      })
      .finally(() => setIsLoading(false));
  }, [selectedTweetId]);

  const tweetIdToTweetMap = useMemo(() => {
    const map: { [key: string]: iTweet } = {};

    replies?.data?.forEach((reply) => {
      map[reply.id] = reply;
    });

    return map;
  }, [replies]);

  const userIdToUserMap = useMemo(() => {
    const map: { [key: string]: iUser } = {};

    replies?.includes?.users?.forEach((user) => {
      map[user.id] = user;
    });

    return map;
  }, [replies]);

  if (!selectedTweetId) {
    return (
      <Alert
        title="🤷‍♂️"
        subTitle="Select a Tweet from the left to start interacting"
      />
    );
  }

  if (isLoading) {
    return <Alert title="⏱" subTitle="Loading..." />;
  }

  if (isError) {
    return (
      <Alert
        title="😟"
        subTitle="Ops! Not able to handle that right now. Can you try later?"
      />
    );
  }

  if (replies?.meta.result_count === 0) {
    return (
      <Alert
        title="😅"
        subTitle="Ops! that tweet has no replies. Maybe try another one"
      />
    );
  }

  return (
    <ul>
      {replies?.data.map((reply, i) => {
        const isReplyActive = i === selectedReplyIndex && isActive;
        const replyingTo =
          reply.referenced_tweets?.[0]?.type === 'replied_to'
            ? tweetIdToTweetMap[reply.referenced_tweets?.[0]?.id]
            : null;

        return (
          <li
            onClick={() => setSelectedReplyIndex(i)}
            key={reply.id}
            className={`flex flex-col my-8 p-2 rounded-lg cursor-pointer ${
              isReplyActive
                ? 'bg-accent bg-opacity-80 hover:bg-accent'
                : 'hover:bg-gray-500'
            }`}
          >
            {replyingTo && (
              <ReplyingTo
                tweet={replyingTo}
                user={userIdToUserMap[replyingTo.author_id]}
              />
            )}

            <section className="flex">
              <div className="w-1/2">
                <Tweet tweet={reply} user={userIdToUserMap[reply.author_id]} />
              </div>

              <div className="w-1/2 relative">
                <ReplyTextArea tweetId={reply.id} isActive={isReplyActive} />
              </div>
            </section>
          </li>
        );
      })}
    </ul>
  );
};

export default Replies;
