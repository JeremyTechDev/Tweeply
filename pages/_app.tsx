import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Alert from '../components/Alert';
import type { AppProps } from 'next/app';

import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  const [dimensions, setDimensions] = useState({
    winWidth: 0,
    winHeight: 0,
  });

  const detectSize = () => {
    setDimensions({
      winWidth: window.innerWidth,
      winHeight: window.innerHeight,
    });
  };

  // Initial render only
  useEffect(detectSize, []);

  // Get new window size on window resize
  useEffect(() => {
    window.addEventListener('resize', detectSize);

    return () => {
      window.removeEventListener('resize', detectSize);
    };
  }, [dimensions]);

  if (dimensions.winWidth < 780) {
    return (
      <Alert
        title="💻"
        subTitle="Tweeply has a better experience on desktop!"
      />
    );
  }

  return (
    <>
      <Head>
        <title>Tweeply</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
