import Modal from 'react-modal';
import '../styles/global.scss';

// Modal.setAppElement('#root')

function MyApp({ Component, pageProps }) {
  return (
    <Component {...pageProps} />
  )
}

export default MyApp
