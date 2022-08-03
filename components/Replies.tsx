import React, { FC, useEffect, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

import { ConversationResponse, SingleTweetResponse } from '../@types';
import { HOTKEY_OPTIONS } from '../helpers/contants';
import Alert from './Alert';
import ReplyTextArea from './ReplyTextArea';
import Tweet from './Tweet';

interface T {
  selectedTweetId: string | null;
}

const Replies: FC<T> = ({ selectedTweetId }) => {
  const [replies, setReplies] = useState<ConversationResponse>();
  const [selectedReplyIndex, setSelectedReplyIndex] = useState<number>(0);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useHotkeys(
    'up',
    () => {
      setSelectedReplyIndex((prev) => {
        if (prev > 0) {
          return prev - 1;
        }
        return 0;
      });
    },
    HOTKEY_OPTIONS,
  );
  useHotkeys(
    'down',
    () => {
      setSelectedReplyIndex((prev) => {
        const maxIndex = replies?.meta?.result_count as number;
        if (prev < maxIndex - 1) {
          return prev + 1;
        }
        return maxIndex - 1;
      });
    },
    HOTKEY_OPTIONS,
    [replies?.meta?.result_count],
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
        const isActive = i === selectedReplyIndex;

        return (
          <li
            onClick={() => setSelectedReplyIndex(i)}
            key={reply.id}
            className={`flex my-8 p-2 rounded-lg ${
              isActive ? 'bg-accent bg-opacity-80' : ''
            }`}
          >
            <div className="w-1/2">
              <Tweet
                tweet={reply}
                user={
                  replies.includes.users.find(
                    (user) => user.id === reply.author_id,
                  ) as SingleTweetResponse['includes']['users'][0]
                }
              />
            </div>

            <ReplyTextArea tweetId={reply.id} isActive={isActive} />
          </li>
        );
      })}
    </ul>
  );
};

export default Replies;
