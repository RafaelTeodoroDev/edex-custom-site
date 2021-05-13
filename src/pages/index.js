import Head from 'next/head';

import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { InProgressRaffle } from '../components/InProgressRaffle';
import { DrawnRaffle } from '../components/DrawnRaffle';

import api from '../services/api';

import styles from '../styles/home.module.scss'

export default function Home({ rafflesInProgress, rafflesCompleted }) {
  return (
   <>
    <Head>
      <title>Edex Custom - Sorteios</title>
    </Head>

    <div className={styles.container}>
      <Header />

      <main>
        <InProgressRaffle data={rafflesInProgress} />
        <DrawnRaffle data={rafflesCompleted} />
      </main>
    </div>

    <Footer />
   </>
  );
}

export const getStaticProps = async () => {
  const responseInProgress = await api.get('/raffles/in-progress');
  const responseCompleted = await api.get('/raffles/completed');

  return {
    props: {
      rafflesInProgress: responseInProgress.data,
      rafflesCompleted: responseCompleted.data,
    },
    revalidate: 60
  };
};