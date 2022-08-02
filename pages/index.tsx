import React, { useState } from 'react';
import { NextPage } from 'next';

import { RecentTweetsResponse } from '../@types/index';
import Tweet from '../components/Tweet';
import Shortcuts from '../components/Shortcuts';
import Replies from '../components/Replies';

interface T {
  tweets: RecentTweetsResponse;
}

const Home: NextPage<T> = ({ tweets }) => {
  const [selectedTweetId, setSelectedTweetId] = useState<string | null>(null);
  const [tab, setTab] = useState<'tweets' | 'replies'>('tweets');

  return (
    <main className="flex container mx-auto px-4">
      <aside className="w-1/3 h-screen">
        <nav className="text-sm font-medium text-center border-b dark:text-gray-400 dark:border-gray-700">
          <ul className="flex flex-wrap justify-center -mb-px">
            <li className="mr-2">
              <a
                href="#"
                className={tab === 'tweets' ? 'active-tab' : 'tab'}
                onClick={() => setTab('tweets')}
              >
                Tweets
              </a>
            </li>
            <li className="mr-2">
              <a
                href="#"
                className={tab === 'replies' ? 'active-tab' : 'tab'}
                onClick={() => setTab('replies')}
                aria-current="page"
              >
                Tweets & Replies
              </a>
            </li>
          </ul>

          <ul className="mt-4 mr-2">
            {tweets.data.map((tweet) => (
              <li
                key={tweet.id}
                className="hover:bg-gray-700 rounded-md cursor-pointer"
                onClick={() => setSelectedTweetId(tweet.id)}
              >
                <Tweet tweet={tweet} user={tweets.includes.users[0]} />
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <section className="w-2/3 h-screen">
        <Shortcuts />
        <Replies selectedTweetId={selectedTweetId} />
      </section>
    </main>
  );
};

export async function getServerSideProps({ res, req }) {
  try {
    const res = await fetch('http://localhost:3000/api/tweets', {
      headers: { cookie: req.headers.cookie },
    });

    if (res.status !== 200) {
      return { props: { tweets: [] } };
    }

    const tweets = await res.json();

    return { props: { tweets } };
  } catch (error) {
    return { props: { tweets: [] } };
  }
}

export default Home;
