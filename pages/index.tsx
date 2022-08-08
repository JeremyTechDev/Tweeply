import React from 'react';
import Link from 'next/link';

const IndexPage = () => {
  return (
    <main>
      <header className="flex justify-between items-center p-6 shadow-2xl">
        <h1 className="font-display text-5xl text-accent font-bold">Tweeply</h1>

        <Link href="/home" passHref>
          <a className="bg-accent rounded-full px-6 py-2 text-lg hover:bg-opacity-80 uppercase">
            Start Interacting
          </a>
        </Link>
      </header>

      <section className="flex justify-evenly items-center w-screen h-[calc(100vh-96px)]">
        <div className="flex flex-col justify-evenly items-start w-1/3">
          <h2 className="text-6xl font-display font-bold">
            Interact with your <span className="text-accent">Twitter</span>{' '}
            followers <span className="text-yellow-300">easier</span> &{' '}
            <span className="text-yellow-300">faster</span>
          </h2>

          <p className="font-display text-2xl my-4">
            F*ck Twitter notifications. Like, reply & retweet all your mentions
            with good UX
          </p>

          <ul className="grid grid-cols-2 gap-7 font-display text-lg list-none mt-5">
            <li>✅ Use only your keyboard</li>
            <li>✅ Engage & grow faster</li>
            <li>✅ No account creation, just login with Twitter</li>
            <li>✅ Free (for now 😉)</li>
            <li className="col-span-2">✅ View the tweet you reply to</li>
          </ul>

          <Link href="/home" passHref>
            <a className="bg-accent my-8 rounded-full px-6 py-2 text-lg hover:bg-opacity-80 uppercase">
              Start now
            </a>
          </Link>
        </div>

        <figure className="w-1/3">Maybe an image here</figure>
      </section>
    </main>
  );
};

export default IndexPage;
