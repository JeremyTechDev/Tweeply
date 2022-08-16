import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { useHotkeys } from 'react-hotkeys-hook';
import { Toaster } from 'react-hot-toast';

import { RecentTweetsResponse } from '../@types/index';
import Alert from '../components/Alert';
import Tweet from '../components/Tweet';
import Shortcuts from '../components/Shortcuts';
import Replies from '../components/Replies';
import { HOTKEY_OPTIONS } from '../helpers/contants';
import { arrowDownControl, arrowUpControl } from '../helpers/arrowControls';
import { getRequest, postRequest } from '../helpers/fetch';

interface T {
  tweets: RecentTweetsResponse | null;
  redirect?: string;
}

const Home: NextPage<T> = ({ tweets, redirect }) => {
  const router = useRouter();
  const [filter, setFilter] = useState<'with-replies' | 'all'>('with-replies');
  const [selectedTweetIndex, setSelectedTweetIndex] = useState(0);
  const [selectedTab, setSelectedTab] = useState<'tweets' | 'replies'>(
    'tweets',
  );

  useEffect(() => {
    if (redirect) {
      router.push(redirect);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useHotkeys('right', () => setSelectedTab('replies'), HOTKEY_OPTIONS);
  useHotkeys('left', () => setSelectedTab('tweets'), HOTKEY_OPTIONS);
  useHotkeys(
    'up',
    () => arrowUpControl(selectedTab === 'tweets', setSelectedTweetIndex),
    HOTKEY_OPTIONS,
    [selectedTab],
  );
  useHotkeys(
    'down',
    () =>
      arrowDownControl(
        selectedTab === 'tweets',
        setSelectedTweetIndex,
        tweets?.meta?.result_count as number,
      ),
    HOTKEY_OPTIONS,
    [selectedTab, tweets?.meta?.result_count],
  );

  const handleLogout = () => {
    postRequest('/auth/logout')
      .then((res) => {
        if (res.status === 204) {
          router.push('/');
          localStorage.removeItem('sinceId');
          localStorage.removeItem('sinceDate');
        }
      })
      .catch(() =>
        alert('Ops, something went wrong logging out, sorry for that'),
      );
  };

  if (tweets?.meta.result_count === 0) {
    return (
      <>
        <Alert
          title="🤷‍♂️"
          subTitle="Seams like you don't tweet that often. No tweets found."
        />
        <button
          onClick={handleLogout}
          className="block mx-auto bg-red-500 px-2 py-1 rounded-lg hover:bg-opacity-80"
        >
          Logout
        </button>
      </>
    );
  }

  const user = tweets?.includes?.users?.[0];
  if (!user && !redirect) {
    return (
      <>
        <Alert
          title="🙆‍♂️"
          subTitle="I am having trouble here, I need your help. Can you refresh the page?"
        />
        <button
          onClick={router.reload}
          className="block mx-auto bg-accent px-2 py-1 rounded-lg hover:bg-opacity-80"
        >
          Refresh
        </button>
      </>
    );
  }

  if (!user) {
    return <Alert title="⏱" subTitle="Loading..." />;
  }

  return (
    <main className="flex container mx-auto px-4">
      <aside
        onClick={() => setSelectedTab('tweets')}
        className={`w-1/3 h-screen overflow-y-auto ${
          selectedTab === 'tweets' && 'bg-gray-700'
        }`}
      >
        <header className="flex p-4 justify-between items-center">
          <h1 className="font-display text-4xl font-bold text-accent">
            Tweeply
          </h1>

          <div className="flex flex-col items-center text-sm">
            <Image
              alt={`Profile picture of ${user.name}`}
              className="rounded-full"
              height={55}
              loader={({ src }) => src}
              src={user.profile_image_url}
              unoptimized
              width={55}
            />
            <Link href={`https://twitter.com/${user.username}`} passHref>
              <a className="hover:underline">@{user.username}</a>
            </Link>
            <button
              title="Logout"
              className="py-x px-1 rounded text-red-500 hover:bg-red-500 hover:bg-opacity-30"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </header>

        <nav className="text-sm font-medium text-center border-b dark:text-gray-400 dark:border-gray-700">
          <ul
            className={`sticky top-0 flex flex-wrap justify-center -mb-px z-10 ${
              selectedTab === 'tweets' ? 'bg-gray-700' : 'bg-dark'
            }`}
          >
            <li
              onClick={() => setFilter('with-replies')}
              className={`mr-2 ${filter === 'all' ? 'tab' : 'active-tab'}`}
            >
              With Replies
            </li>
            <li
              onClick={() => setFilter('all')}
              className={`mr-2 ${filter === 'all' ? 'active-tab' : 'tab'}`}
            >
              All Tweets
            </li>
          </ul>
        </nav>

        <ul className="mt-4 mx-2">
          {tweets?.data
            ?.filter((tweets) => {
              if (filter === 'with-replies') {
                return tweets.public_metrics.reply_count >= 1;
              }
              return true;
            })
            ?.map((tweet, i) => {
              const isTweetActive = i === selectedTweetIndex;

              return (
                <li
                  key={tweet.id}
                  onClick={() => setSelectedTweetIndex(i)}
                  className={`my-8 tweet ${
                    isTweetActive ? 'tweet-selected' : ''
                  }`}
                >
                  <ul>
                    <Tweet
                      tweet={tweet}
                      user={user}
                      media={tweets.includes.media}
                    />
                  </ul>
                </li>
              );
            })}
        </ul>
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

      <Toaster />
    </main>
  );
};

export async function getServerSideProps({ req }) {
  try {
    const response = await getRequest('/tweets', {
      cookie: req.headers.cookie,
    });

    if (response.status >= 400 && response.status < 500) {
      return {
        props: {
          redirect: '/api/auth/token?redirect=1',
          tweets: null,
        },
      };
    }

    const tweets = await response.json();

    return { props: { tweets } };
  } catch (error) {
    return { props: { tweets: null } };
  }
}

export default Home;
