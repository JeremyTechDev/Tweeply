import React, { FC } from 'react';
import Image from 'next/image';
import { RecentTweetsResponse, ConversationResponse } from '../@types';

interface T {
  tweet: RecentTweetsResponse['data'][0] | ConversationResponse['data'][0];
  user:
    | RecentTweetsResponse['includes']['users'][0]
    | ConversationResponse['includes']['users'][0];
}

const Tweet: FC<T> = ({ tweet, user }) => {
  return (
    <article className="flex flex-col py-2 px-4 border-gray-400">
      <figure className="flex w-full">
        <Image
          alt="profile image"
          className="rounded-full -z-0"
          objectFit="contain"
          height={50}
          loader={({ src }) => src}
          src={user.profile_image_url}
          width={50}
        />
        <figcaption className="text-left ml-2">
          <h5 className="text-lg text-white">{user.name}</h5>
          <p>@{user.username}</p>
        </figcaption>
      </figure>

      <div className="my-1 text-left text-white whitespace-pre-wrap">{tweet.text}</div>

      <div className="my-1">
        <ul className="flex justify-between">
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
