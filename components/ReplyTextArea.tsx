import React, { FC, useEffect, useRef, useState } from 'react';
import ShortcutsListener from './ShortcutsListener';

interface T {
  tweetId: string;
  tweetDate: string;
  isActive: boolean;
  handleGoToNextReply: () => void;
}

const ReplyTextArea: FC<T> = ({
  isActive,
  tweetDate,
  tweetId,
  handleGoToNextReply,
}) => {
  const [value, setValue] = useState('');
  const [status, setStatus] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    if (isActive && ref.current) {
      // @ts-ignore focus() method is actually set
      ref.current.focus();
    }
  }, [isActive, ref]);

  const handleChangeStatus = (newStatus: string) => {
    setStatus(newStatus);
    handleGoToNextReply();

    /**
     * update 'sinceId' with the newest interaction tweet
     * with this, the next request will bring only new tweets
     */
    const sinceId = localStorage.getItem('sinceId');
    const sinceDate = localStorage.getItem('sinceDate');

    if (!sinceId || !sinceDate) {
      localStorage.setItem('sinceId', tweetId);
      localStorage.setItem('sinceDate', tweetDate);
    } else {
      if (new Date(tweetDate) > new Date(sinceDate)) {
        localStorage.setItem('sinceId', tweetId);
        localStorage.setItem('sinceDate', tweetDate);
      }
    }
  };

  return (
    <>
      <textarea
        ref={ref}
        maxLength={280}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type your reply here..."
        value={value}
        defaultValue={value}
        className={`reply-textarea ${
          Boolean(status) ? 'bg-green-300 bg-opacity-30' : 'bg-gray-600'
        }`}
      />

      {Boolean(status) && (
        <span className="absolute left-2 bottom-1">{status}</span>
      )}

      {Boolean(value.length) && (
        <span className="text-xs absolute right-1 bottom-1">
          {280 - value.length}
        </span>
      )}

      {isActive && (
        <ShortcutsListener
          tweetId={tweetId}
          value={value}
          setStatus={handleChangeStatus}
        />
      )}
    </>
  );
};

export default ReplyTextArea;
