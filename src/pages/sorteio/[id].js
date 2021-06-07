import Head from 'next/head';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { SubscriptionModal } from '../../components/SubscriptionModal';
import { SearchModal } from '../../components/SearchModal';
import { SubscriptionButton } from '../../components/SubscriptionButton';
import { RaffleGallery } from '../../components/RaffleGallery';

import Markdown from 'react-markdown';

import api from '../../services/api';

import styles from '../../styles/raffle.module.scss';

import { parseISO, format } from 'date-fns';

export default function Raffle({ raffle, subscriptions }) {
  const { query, isFallback } = useRouter();
  const { id } = query;

  const [selecteds, setSelecteds] = useState([])
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [raffleSubscriptions, setRaffleSubscriptions] = useState(subscriptions);
  const [raffleNumbers, setRaffleNumbers] = useState([]);

  const numbers = useMemo(() => {
    return Array.from({ length: raffle?.amount }).map((item, index) => index + 1) || [];
  }, [raffle])

  const paidNumbers = useMemo(() => {
    return raffleSubscriptions?.filter(subscription => subscription.booking.is_paid)
                               .map(subscription => subscription.number) || []
  }, [raffleSubscriptions]);

  const subscribedNumbers = useMemo(() => {
    return raffleSubscriptions?.filter(subscription => !subscription.booking.is_paid)
                               .map(subscription => subscription.number) || []
  }, [raffleSubscriptions]);

  const availableNumbers = useMemo(() => {
    return numbers.filter(number => !subscribedNumbers.includes(number) 
        && !paidNumbers.includes(number)) || [];
  }, [numbers, subscribedNumbers, paidNumbers]);  

  const dateEndFormatted = useMemo(() => {
    if (!raffle) return null;
    if (!raffle.date_end) return null;

    return format(parseISO(raffle.date_end), 'dd/MM/yyyy')
  }, [raffle])

  function handleSelectNumber(number) {
    if (selecteds.find(selected => selected === number)) {
      setSelecteds(prev => prev.filter(selected => selected !== number));
    } else {
      setSelecteds(prev => [...prev, number]);
    }
  }

  function handleSubscribe() {
    setIsSubscriptionModalOpen(true);
  }

  function handleOpenSearchBooking () {
    setIsSearchModalOpen(true);
  }

  useEffect(() => {
    if (!isFallback) {
      setRaffleNumbers(numbers)
    }
  }, [isFallback, numbers])

  useEffect(() => {
    setRaffleSubscriptions(subscriptions);
  }, [subscriptions])

  return (
    <>
      <Head>
        <title>{raffle?.name} - Edex Custom</title>
      </Head>

      <div className={styles.container}>
        <Header />

        <main>

          <h1>{raffle?.name}</h1>

          <RaffleGallery raffle={raffle} />

          {raffle?.date_end !== null && (
              <p className={styles.advise}>
                A data para o sorteio está prevista para o dia {dateEndFormatted}
              </p>
          )}

          <div className={styles.filters}>
            <button type="button" onClick={() => setRaffleNumbers(numbers)}>
              Todos ({numbers.length})
            </button>

            <button type="button" onClick={() => setRaffleNumbers(availableNumbers)}>
              Disponível ({availableNumbers.length})
            </button>

            <button type="button" onClick={() => setRaffleNumbers(subscribedNumbers)}>
              Reservado ({subscribedNumbers.length})
            </button>

            <button type="button" onClick={() => setRaffleNumbers(paidNumbers)}>
              Pago ({paidNumbers.length})
            </button>

            <button type="button" onClick={handleOpenSearchBooking}>
              Consultar reserva
            </button>
          </div>
          
          <section className={styles.numberContainer}>
            {raffleNumbers.map(number => (
              <SubscriptionButton
                key={`raffle-${id}-number-${number}`}
                value={number}
                raffle={raffle}
                isSelected={!!selecteds.find(selected => selected === number)}
                isSubscribed={subscriptions.find(subscription => subscription.number === number)}
                onClick={handleSelectNumber}
              />
            ))}
          </section>

          {!!selecteds.length && (
            <button type="button" className={styles.subscribeButton} onClick={handleSubscribe}>
              Reservar Número(s)
            </button>
          )}

          {raffle?.rules && (
            <section className={styles.rules}>
              <h3>Regulamento</h3>

              <Markdown>{raffle?.rules}</Markdown>
            </section>
          )}

        </main>

        <SubscriptionModal
          isOpen={isSubscriptionModalOpen}
          onRequestClose={() => setIsSubscriptionModalOpen(false)}
          data={{
            raffle,
            numbers: selecteds
          }}
        />

        <SearchModal
          isOpen={isSearchModalOpen}
          onRequestClose={() => setIsSearchModalOpen(false)}
          data={raffle}
        />
      </div>

      <Footer />
    </>
  );

}


export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: true
  }
};

export const getStaticProps = async (context) => {
  const { id } = context.params;

  const raffleResponse = await api.get(`/raffles/${id}`)
  const subscriptionsResponse = await api.get('/subscriptions', { params: { raffle_id: id } });

  return {
    props: {
      raffle: raffleResponse.data,
      subscriptions: subscriptionsResponse.data
    },
    revalidate: 1,
  }

};