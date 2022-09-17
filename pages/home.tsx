import React, { useMemo, useState } from 'react';
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
  tweetsData: RecentTweetsResponse | null;
}

const Home: NextPage<T> = ({ tweetsData }) => {
  const router = useRouter();
  const [selectedTweetIndex, setSelectedTweetIndex] = useState(0);
  // Whether to include all tweets or only tweets with replies
  const [filter, setFilter] = useState<'with-replies' | 'all'>('with-replies');
  // Whether keyboard is focused on tweets tab (left) or replies tab (right)
  const [selectedTab, setSelectedTab] = useState<'tweets' | 'replies'>(
    'tweets',
  );

  /**
   * Filters tweets with no replies when filter === 'with-replies'
   */
  const tweets = useMemo(() => {
    return (
      tweetsData?.data?.filter((tweets) => {
        if (filter === 'with-replies') {
          return tweets.public_metrics.reply_count >= 1;
        }

        return true;
      }) || []
    );
  }, [tweetsData, filter]);

  // Keyboard event: focus on replies tab
  useHotkeys('right', () => setSelectedTab('replies'), HOTKEY_OPTIONS);
  // Keyboard event: focus on tweets tab
  useHotkeys('left', () => setSelectedTab('tweets'), HOTKEY_OPTIONS);
  // Keyboard event: focus on one tweet/reply up
  useHotkeys(
    'up',
    () => arrowUpControl(selectedTab === 'tweets', setSelectedTweetIndex),
    HOTKEY_OPTIONS,
    [selectedTab],
  );
  // Keyboard event: focus on one tweet/reply down
  useHotkeys(
    'down',
    () =>
      arrowDownControl(
        selectedTab === 'tweets',
        setSelectedTweetIndex,
        tweetsData?.meta?.result_count as number,
      ),
    HOTKEY_OPTIONS,
    [selectedTab, tweetsData?.meta?.result_count],
  );

  const handleLogout = () => {
    postRequest('/auth/logout')
      .then((res) => {
        if (res.status === 204) {
          router.push('/');
        }
      })
      .catch((e) => {
        console.error(e);
        alert('Ops, something went wrong logging out, sorry for that');
      });
  };

  // If not tweets are found, show alert
  if (tweetsData?.meta.result_count === 0) {
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

  // Twitter includes the authenticated user data in the first index of the `users` list
  const user = tweetsData?.includes?.users?.[0];
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
          {tweets
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
                      media={tweetsData.includes.media}
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
          userId={user.id}
          selectedTweetId={tweets[selectedTweetIndex].id}
          isActive={selectedTab === 'replies'}
        />
      </section>

      <Toaster />
    </main>
  );
};

export async function getServerSideProps({ req, res }) {
  try {
    // Get recent tweets for the user
    const response = await getRequest('/tweets', {
      cookie: req.headers.cookie,
    });

    // If not logged in, authenticate first with auto redirect
    if (response.status >= 400 && response.status < 500) {
      return {
        redirect: {
          destination: '/api/auth/token?redirect=1',
          permanent: false,
        },
      };
    }

    const tweetsData = await response.json();

    return { props: { tweetsData } };
  } catch (error) {
    return { props: { tweetsData: null } };
  }
}

export default Home;
