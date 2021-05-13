import Head from 'next/head';

import { useState, useMemo, useEffect } from 'react';
import api from '../../services/api';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';

import Markdown from 'react-markdown';

import { FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';

import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

import styles from '../../styles/booking.module.scss';

export default function Booking({ paymentMethods }) {
  const router = useRouter();
  const { id } = router.query;

  const { register, handleSubmit, formState: { errors } } = useForm();

  const [booking, setBooking] = useState({});
  const [submiting, setSubmiting] = useState(false);

  const numbers = useMemo(() => {
    return booking.subscriptions?.map(subscription => subscription.number).join(', ') || ''
  }, [booking])

  const totalPriceFormatted = useMemo(() => {
    return (booking.subscriptions?.length * booking.raffle?.ticket_price)
      .toLocaleString('pt-BR', {
        currency: 'BRL',
        style: 'currency'
      });
  }, [booking])

  async function loadBooking() {
    const response = await api.get(`/bookings/${id}`);
    setBooking(response.data);
  }

  async function onSubmit(data) {
    try {
      if (!data.billing?.length) return;
      setSubmiting(true);

      const formData = new FormData();
      formData.append('data', "{}")
      formData.append('files.billing', data.billing[0]);

      await api.put(`/bookings/${booking.id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      loadBooking()

    } finally {
      setSubmiting(false);
    }
  }

  useEffect(() => {
    id && loadBooking();
  }, [id])

  return (
    <>
      <Head>
        <title>Reserva feita - Edex Custom</title>
      </Head>

      <div className={styles.container}>
        <Header />

        <main>
          <section className={styles.infoContainer}>
            <header>
              <strong>Informações da Reserva</strong>
            </header>

            <main>
              <ul>
                <li>
                  <span>Participante:</span>
                  <span>{booking.name}</span>
                </li>

                <li>
                  <span>Telefone:</span>
                  <span>{booking.phone}</span>
                </li>

                <li>
                  <span>Quantidade:</span>
                  <span>{booking.subscriptions?.length} número(s)</span>
                </li>

                <li>
                  <span>Números Reservados:</span>
                  <span>{numbers}</span>
                </li>

                <li className={styles.price}>
                  <span>Valor a pagar:</span>
                  <span>{totalPriceFormatted}</span>
                </li>
              </ul>

              {booking.is_paid && (
                <span className={styles.billingSuccess}>
                  <FaCheckCircle />
                  Pagamento concluído!
                </span>
              )}

              {!booking.is_paid && !booking.billing && (
                <form onSubmit={handleSubmit(onSubmit)}>
                  <p>Para prosseguir com o pagamento, é necessário que você envie o seu comprovante do pagamento.</p>

                  <input type="file" {...register('billing')} />
                  <small>{errors.billing?.message}</small>

                  <button type="submit" disabled={submiting}>
                    {submiting ? 'Enviando...' : 'Enviar comprovante'}
                  </button>
                </form>
              )}

              {!booking.is_paid && booking.billing && (
                <span className={styles.billingAlert}>
                  <FaExclamationCircle />
                  Nós recebemos o seu comprovante, em breve vamos analisar o seu pagamento.
                </span>
              )}
            </main>
          </section>

          <section className={styles.infoContainer}>
            <header>
              <strong>Informações do Sorteio</strong>
            </header>

            <main>
              <ul>
                <li>
                  <span>Sorteio:</span>
                  <span>{booking.raffle?.name}</span>
                </li>

                <li>
                  <span>Data prevista do Sorteio:</span>
                  <span>{booking.raffle?.date_end}</span>
                </li>
              </ul>

              <img 
                src={`${process.env.NEXT_PUBLIC_API_URL}${booking.raffle?.images[0].url}`} 
                alt={booking.raffle?.name} 
              />
            </main>
          </section>
        </main>

        

        <section className={styles.paymentMethods}>
          <h2>Formas de pagamento</h2>

          <main>
            {paymentMethods?.map(method => (
              <div className={styles.paymentMethod}>
                <img src={`${process.env.NEXT_PUBLIC_API_URL}${method.logo.url}`} alt={method.name} />

                <strong>{method.name}</strong>
                <Markdown>{method.description}</Markdown>
              </div>
            ))}
          </main>
        </section>

        <Footer />
      </div>
    </>
  );
}

export const getServerSideProps = async () => {
  const response = await api.get('/payment-methods');

  return {
    props: {
      paymentMethods: response.data,
    }
  }
};