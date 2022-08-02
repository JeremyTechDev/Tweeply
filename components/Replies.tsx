import React, { FC, useEffect, useState } from 'react';
import { ConversationResponse, SingleTweetResponse } from '../@types';
import Tweet from './Tweet';

interface T {
  selectedTweetId: string | null;
}

const Replies: FC<T> = ({ selectedTweetId }) => {
  const [replies, setReplies] = useState<ConversationResponse>();
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
      <div className="text-center">
        <h4 className="text-8xl mb-2">🤷‍♂️</h4>
        <p>Select a Tweet from the left to start interacting</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center">
        <h4 className="text-8xl mb-2">⏱</h4>
        <p>Loading...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center">
        <h4 className="text-8xl mb-2">☹️</h4>
        <p>Ops! Not able to handle that right now. Can you try later?</p>
      </div>
    );
  }

  if (replies?.meta.result_count === 0) {
    return (
      <div className="text-center">
        <h4 className="text-8xl mb-2">🥊</h4>
        <p>There is nothing here</p>
      </div>
    );
  }

  return (
    <ul>
      {replies?.data.map((reply, i) => (
        <li key={reply.id} className="w-2/3">
          <Tweet
            tweet={reply}
            user={
              replies.includes.users.find(
                (user) => user.id === reply.author_id,
              ) as SingleTweetResponse['includes']['users'][0]
            }
          />
        </li>
      ))}
    </ul>
  );
};

export default Replies;
