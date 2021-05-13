import Head from 'next/head';

import api from '../services/api';

import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { DrawnRaffle } from '../components/DrawnRaffle';

import styles from '../styles/home.module.scss';

export default function Drawn({ raffles }) {
  return (
    <>
      <Head>
        <title>Sorteios Realizados - Edex Custom</title>
      </Head>

      <div className={styles.container}>
        <Header />

        <DrawnRaffle data={raffles} />

        <Footer />
      </div>
    </>
  );
}

export const getStaticProps = async () => {
  const response = await api.get('/raffles/completed');

  return {
    props: {
      raffles: response.data,
    },
    revalidate: 60
  };
};