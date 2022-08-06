import React, { useState } from 'react';
import { NextPage } from 'next';
import { useHotkeys } from 'react-hotkeys-hook';

import { RecentTweetsResponse } from '../@types/index';
import Tweet from '../components/Tweet';
import Shortcuts from '../components/Shortcuts';
import Replies from '../components/Replies';
import { HOTKEY_OPTIONS } from '../helpers/contants';

interface T {
  tweets: RecentTweetsResponse;
}

const Home: NextPage<T> = ({ tweets }) => {
  const [tab, setTab] = useState<'tweets' | 'tweets&replies'>('tweets');
  const [selectedTweetIndex, setSelectedTweetIndex] = useState(0);
  const [selectedTab, setSelectedTab] = useState<'tweets' | 'replies'>(
    'tweets',
  );

  useHotkeys('right', () => setSelectedTab('replies'), HOTKEY_OPTIONS);
  useHotkeys('left', () => setSelectedTab('tweets'), HOTKEY_OPTIONS);
  useHotkeys(
    'up',
    () => {
      if (selectedTab === 'tweets') {
        setSelectedTweetIndex((prev) => {
          if (prev > 0) {
            return prev - 1;
          }
          return 0;
        });
      }
    },
    HOTKEY_OPTIONS,
    [selectedTab],
  );
  useHotkeys(
    'down',
    () => {
      if (selectedTab === 'tweets') {
        setSelectedTweetIndex((prev) => {
          const maxIndex = tweets?.meta?.result_count as number;
          if (prev < maxIndex - 1) {
            return prev + 1;
          }
          return maxIndex - 1;
        });
      }
    },
    HOTKEY_OPTIONS,
    [selectedTab, tweets?.meta?.result_count],
  );

  return (
    <main className="flex container mx-auto px-4">
      <aside
        onClick={() => setSelectedTab('tweets')}
        className={`w-1/3 h-screen overflow-y-auto ${
          selectedTab === 'tweets' && 'bg-gray-700'
        }`}
      >
        <nav className="text-sm font-medium text-center border-b dark:text-gray-400 dark:border-gray-700">
          <ul
            className={`sticky top-0 flex flex-wrap justify-center -mb-px z-10 ${
              selectedTab === 'tweets' ? 'bg-gray-700' : 'bg-dark'
            }`}
          >
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
                className={tab === 'tweets&replies' ? 'active-tab' : 'tab'}
                onClick={() => setTab('tweets&replies')}
                aria-current="page"
              >
                Tweets & Replies
              </a>
            </li>
          </ul>

          <ul className="mt-4 mx-2">
            {tweets?.data?.map((tweet, i) => {
              const isTweetActive = i === selectedTweetIndex;

              return (
                <li
                  key={tweet.id}
                  className={`my-8 rounded-md cursor-pointer hover:bg-gray-600 ${
                    isTweetActive
                      ? 'bg-accent bg-opacity-80 hover:bg-accent'
                      : ''
                  }`}
                  onClick={() => setSelectedTweetIndex(i)}
                >
                  <Tweet tweet={tweet} user={tweets.includes.users[0]} />
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      <section
        className={`w-2/3 h-screen overflow-y-auto px-4 ${
          selectedTab === 'replies' && 'bg-gray-700'
        }`}
        onClick={() => setSelectedTab('replies')}
      >
        <Shortcuts
          bgColor={selectedTab === 'replies' ? 'bg-dark' : 'bg-gray-700'}
        />
        <Replies
          selectedTweetId={tweets.data[selectedTweetIndex].id}
          isActive={selectedTab === 'replies'}
        />
      </section>
    </main>
  );
};

export async function getServerSideProps({ req }) {
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
