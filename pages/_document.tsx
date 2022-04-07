import { NextPage } from 'next';
import { Html, Head, Main, NextScript } from 'next/document';

const Document: NextPage = () => {
  return (
    <Html lang='en'>
      <Head>
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' />
        <link
          href='https://fonts.googleapis.com/css2?family=IBM+Plex+Sans&display=swap'
          rel='stylesheet'
        />
      </Head>
      <body className='m-4 bg-reddit-light-gray font-ibm-sans dark:bg-black'>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;
