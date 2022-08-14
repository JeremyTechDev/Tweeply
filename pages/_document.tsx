import React from 'react';
import Script from 'next/script';
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const originalRenderPage = ctx.renderPage;

    // Run the React rendering logic synchronously
    ctx.renderPage = () =>
      originalRenderPage({
        // Useful for wrapping the whole react tree
        enhanceApp: (App: any) => App,
        // Useful for wrapping in a per-page basis
        enhanceComponent: (Component: any) => Component,
      });

    // Run the parent `getInitialProps`, it now includes the custom `renderPage`
    const initialProps = await Document.getInitialProps(ctx);

    return initialProps;
  }

  title = '';
  subTitle = '';
  imgUrl = '';

  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta name="theme-color" content="#55acee" />
          <meta name="description" content={this.subTitle} />
          <meta property="og:type" content="website" />
          <meta property="og:title" content={this.title} />
          <meta property="og:description" content={this.subTitle} />
          <meta property="og:site_name" content="Tweeply-app.com" />
          <meta property="og:image" content={this.imgUrl} />
          <meta property="og:image" content="https://tweeply-app.herokuapp.com/frame.png" />
          <meta property="og:url" content="https://tweeply-app.herokuapp.com" />
          <meta property="twitter:card" content="summary" />
          <meta property="twitter:site" content="@JeremyTechDev" />
          <meta property="twitter:title" content={this.title} />
          <meta property="twitter:description" content={this.subTitle} />
          <meta property="twitter:image" content={this.imgUrl} />
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
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="true"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=League+Spartan:wght@400;700&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
