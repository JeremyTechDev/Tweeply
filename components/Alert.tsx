import React, { FC } from 'react';

interface T {
  title: string;
  subTitle?: string;
}

const Alert: FC<T> = ({ title, subTitle }) => {
  return (
    <div className="text-center">
      <h4 className="text-8xl mb-2">{title}</h4>
      {Boolean(subTitle) && <span>{subTitle}</span>}
    </div>
  );
};

export default Alert;
