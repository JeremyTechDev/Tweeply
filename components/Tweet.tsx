import React, { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import twitterText from 'twitter-text';

import { iTweet, iUser, RecentTweetsResponse } from '../@types';

interface T {
  tweet: iTweet;
  user: iUser;
  media: RecentTweetsResponse['includes']['media'];
}

const Tweet: FC<T> = ({ tweet, user, media }) => {
  return (
    <article className="flex flex-col py-2 px-4">
      <figure className="flex w-full items-center">
        <figure>
          <Image
            alt={`Profile picture of ${user.name}`}
            className="rounded-full -z-0"
            height={50}
            loader={({ src }) => src}
            objectFit="cover"
            src={user.profile_image_url}
            unoptimized
            width={50}
          />
        </figure>
        <figcaption className="text-left ml-2">
          <h5 className="text-lg text-white">{user.name}</h5>
          <Link
            passHref
            target="_blank"
            href={`https://twitter.com/${user.username}`}
          >
            <a className="text-gray-300 hover:underline">@{user.username}</a>
          </Link>
        </figcaption>
      </figure>

      <div
        className="my-1 text-left text-white whitespace-pre-wrap"
        dangerouslySetInnerHTML={{
          __html: twitterText.autoLink(twitterText.htmlEscape(tweet.text), {
            usernameClass: 'text-accent hover:underline',
            hashtagClass: 'text-accent hover:underline',
            cashtagClass: 'text-accent hover:underline',
            usernameIncludeSymbol: true,
            targetBlank: true,
          }),
        }}
      />

      {Boolean(tweet.attachments?.media_keys) && (
        <ul className="w-full flex">
          {media?.map((attachment) => {
            if (tweet.attachments?.media_keys?.includes(attachment.media_key)) {
              return (
                <li className="m-px" key={attachment.media_key}>
                  <Image
                    src={
                      attachment.url || (attachment.preview_image_url as string)
                    }
                    alt={attachment.alt_text}
                    className="rounded-md"
                    height={150}
                    loader={({ src }) => src}
                    objectFit="cover"
                    unoptimized
                    width={150}
                  />
                </li>
              );
            }
            return null;
          })}
        </ul>
      )}

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
