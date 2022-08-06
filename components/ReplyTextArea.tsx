import React, { FC, useEffect, useRef, useState } from 'react';
import ShortcutsListener from './ShortcutsListener';

interface T {
  tweetId: string;
  isActive: boolean;
}

const ReplyTextArea: FC<T> = ({ isActive, tweetId }) => {
  const [value, setValue] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    if (isActive && ref.current) {
      ref.current.focus();
    }
  }, [isActive, ref]);

  return (
    <>
      <textarea
        ref={ref}
        className="reply-textarea"
        maxLength={280}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type your reply here..."
        value={value}
      />

      {Boolean(value.length) && (
        <span className="text-xs absolute right-1 bottom-1">
          {value.length}/280
        </span>
      )}

      {isActive && <ShortcutsListener tweetId={tweetId} value={value} />}
    </>
  );
};

export default ReplyTextArea;
