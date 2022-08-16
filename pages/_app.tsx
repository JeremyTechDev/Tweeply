import React, { useEffect, useState } from 'react';
import Script from 'next/script';
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

  // In case the screen resizes
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
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-8BJSXBHD9K"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){window.dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('config', 'G-8BJSXBHD9K');
            `}
      </Script>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
