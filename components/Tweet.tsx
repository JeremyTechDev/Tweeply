import React, { FC } from 'react';
import Image from 'next/image';

import { iTweet, iUser } from '../@types';

interface T {
  tweet: iTweet;
  user: iUser;
}

const Tweet: FC<T> = ({ tweet, user }) => {
  return (
    <article className="flex flex-col py-2 px-4">
      <figure className="flex w-full items-center">
        <figure>
          <Image
            alt="profile image"
            className="rounded-full -z-0"
            objectFit="contain"
            height={50}
            loader={({ src }) => src}
            src={user.profile_image_url}
            width={50}
          />
        </figure>
        <figcaption className="text-left ml-2">
          <h5 className="text-lg text-white">{user.name}</h5>
          <p className="text-gray-300">@{user.username}</p>
        </figcaption>
      </figure>

      <div className="my-1 text-left text-white whitespace-pre-wrap">
        {tweet.text}
      </div>

      <div className="my-1">
        <ul className="flex justify-between text-gray-300">
          <li title="Replies">💬 {tweet.public_metrics.reply_count}</li>
          <li title="Retweets">🔁 {tweet.public_metrics.retweet_count}</li>
          <li title="Quote Retweets">✏️ {tweet.public_metrics.quote_count}</li>
          <li title="Likes">❤️ {tweet.public_metrics.like_count}</li>
        </ul>
      </div>
    </article>
  );
};

export default Tweet;
