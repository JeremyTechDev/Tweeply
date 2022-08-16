import React, { FC, useEffect, useMemo, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

import { ConversationResponse, iTweet, iUser } from '../@types';
import { arrowDownControl, arrowUpControl } from '../helpers/arrowControls';
import { HOTKEY_OPTIONS } from '../helpers/contants';
import { getRequest } from '../helpers/fetch';
import Alert from './Alert';
import ReplyingTo from './ReplyingTo';
import ReplyTextArea from './ReplyTextArea';
import Tweet from './Tweet';

interface T {
  selectedTweetId: string | null;
  isActive: boolean;
  userId: string;
}

const Replies: FC<T> = ({ selectedTweetId, isActive, userId }) => {
  const [replies, setReplies] = useState<ConversationResponse>();
  const [hideSelfReplies, setHideSelfReplies] = useState(false);
  const [selectedReplyIndex, setSelectedReplyIndex] = useState<number>(0);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useHotkeys(
    'up',
    () => arrowUpControl(isActive, setSelectedReplyIndex),
    HOTKEY_OPTIONS,
    [isActive],
  );
  const handleArrowDown = () =>
    arrowDownControl(
      isActive,
      setSelectedReplyIndex,
      replies?.meta?.result_count as number,
    );
  useHotkeys('down', handleArrowDown, HOTKEY_OPTIONS, [
    isActive,
    replies?.meta?.result_count,
  ]);

  useEffect(() => {
    setIsLoading(true);
    setIsError(false);

    if (!selectedTweetId) {
      setIsError(true);
      return;
    }

    const sinceId = localStorage.getItem('sinceId');
    const sinceIdParam = sinceId ? `?sinceId=${sinceId}` : '';
    getRequest(`/tweets/${selectedTweetId}/conversation/${sinceIdParam}`)
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
      <Alert title="😉" subTitle="No new replies for this Tweet. Nice work!" />
    );
  }

  return (
    <div>
      <div className="flex justify-end">
        <input
          type="checkbox"
          checked={hideSelfReplies}
          onChange={() => setHideSelfReplies((prev) => !prev)}
        />
        Hide self-replies
      </div>
      {replies?.data
        ?.filter((reply) =>
          hideSelfReplies ? reply.author_id !== userId : true,
        )
        ?.map((reply, i) => {
          const isReplyActive = i === selectedReplyIndex && isActive;
          const replyingTo =
            reply.referenced_tweets?.[0]?.type === 'replied_to'
              ? tweetIdToTweetMap[reply.referenced_tweets?.[0]?.id]
              : null;

          return (
            <li
              key={reply.id}
              onClick={() => setSelectedReplyIndex(i)}
              className={`flex flex-col my-8 p-2 tweet ${
                isReplyActive ? 'tweet-selected' : ''
              }`}
            >
              <ul>
                {replyingTo && (
                  <ReplyingTo
                    tweet={replyingTo}
                    user={userIdToUserMap[replyingTo.author_id]}
                  />
                )}

                <section className="flex">
                  <div className="w-1/2">
                    <Tweet
                      tweet={reply}
                      user={userIdToUserMap[reply.author_id]}
                      media={replies.includes.media}
                    />
                  </div>

                  <div className="w-1/2 relative">
                    <ReplyTextArea
                      tweetDate={reply.created_at}
                      tweetId={reply.id}
                      isActive={isReplyActive}
                      handleGoToNextReply={handleArrowDown}
                    />
                  </div>
                </section>
              </ul>
            </li>
          );
        })}
    </div>
  );
};

export default Replies;
