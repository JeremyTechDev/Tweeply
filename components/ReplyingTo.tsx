import Link from 'next/link';
import Image from 'next/image';
import React, { FC } from 'react';
import { iTweet, iUser } from '../@types';

interface T {
  tweet: iTweet;
  user: iUser;
}

const ReplyingTo: FC<T> = ({ tweet, user }) => {
  return (
    <section className="mb-4 px-6 py-3 bg-gray-800 rounded-md">
      <span className="text-xs block mb-2 text-gray-400">Replying to:</span>

      <div className="flex items-center">
        <Image
          alt={`Profile picture of ${user.name}`}
          className="rounded-full -z-0"
          objectFit="contain"
          height={35}
          loader={({ src }) => src}
          src={user.profile_image_url}
          width={35}
        />

        <p className="ml-2">
          {user.name}{' '}
          <Link
            href={`https://twitter.com/${user.username}`}
            passHref
            target="_blank"
          >
            <a className="text-gray-400 hover:underline">@{user.username}</a>
          </Link>
        </p>
      </div>

      <p className="mt-2 text-white whitespace-pre-wrap">{tweet.text}</p>
    </section>
  );
};

export default ReplyingTo;
