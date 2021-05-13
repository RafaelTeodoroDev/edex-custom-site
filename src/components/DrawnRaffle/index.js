import { useMemo } from 'react';
import styles from './styles.module.scss';

export function DrawnRaffle({ data }) {
  const raffles = useMemo(() => {
    return data.map(raffle => ({
      ...raffle,
      thumbnail: raffle.images[0].url,
    }))
  }, [data])


  return (
    <section className={styles.raffleContainer}>
      <h2>Últimos <span>sorteios</span> realizados</h2>
      
      <main>
        {raffles.map(raffle => (
          <div className={styles.raffle}>
            <div className={styles.info}>
              <span>Número {String(raffle.number).padStart(4, '0')}</span>
              <small>Concurso {String(raffle.competition).padStart(4, '0')}</small>
            </div>
            <img
              src={raffle?.thumbnail}
              alt={raffle.name}
            />
            <span>Ganhador: <strong>{raffle.winner}</strong></span>
          </div>
        ))}
      </main>
    </section>
  );
}