import Head from 'next/head';
import Modal from 'react-modal';
import '../styles/global.scss';

// Modal.setAppElement('#root')

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"  />
      </Head>

      <Component {...pageProps} />
    </>
  )
}

export default MyApp
