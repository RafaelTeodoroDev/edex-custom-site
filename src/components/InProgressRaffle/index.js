import { useMemo } from 'react';

import Link from 'next/link';

import styles from './styles.module.scss';

export function InProgressRaffle({ data }) {
  const raffles = useMemo(() => {
    return data.map(raffle => ({
      ...raffle,
      thumbnail: raffle.images[0].url,
    }))

  }, [data])

  return (
    <section className={styles.raffleContainer}>
      <h1>Sorteio em <span>andamento</span></h1>
      
      <main>
        {raffles.map(raffle => (
          <div className={styles.raffle} key={String(`raffle-${raffle.id}`)}>
            <picture>
              <img src={`${process.env.NEXT_PUBLIC_API_URL}${raffle.thumbnail}`} alt={raffle.name} />
            </picture>
            <strong>{raffle.name}</strong>
            
            <Link href={`/sorteio/${raffle.uid}`} passHref>
              <button type="button">Clique e Participe</button>
            </Link>
          </div>
        ))}
      </main>
    </section>
  );
}