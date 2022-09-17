import React, { FC, useEffect, useRef, useState } from 'react';
import ShortcutsListener from './ShortcutsListener';

interface T {
  tweetId: string;
  isActive: boolean;
  handleGoToNextReply: () => void;
}

const ReplyTextArea: FC<T> = ({ isActive, tweetId, handleGoToNextReply }) => {
  // The content of the reply to post
  const [value, setValue] = useState('');
  // The status of the action, whether success of fail
  const [status, setStatus] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    if (isActive && ref.current) {
      // @ts-ignore focus() method is set
      ref.current.focus();
    }
  }, [isActive, ref]);

  const handleChangeStatus = (newStatus: string) => {
    setStatus(newStatus);
    handleGoToNextReply();
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
