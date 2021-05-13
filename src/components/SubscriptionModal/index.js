import { useMemo } from 'react';

import { useForm } from "react-hook-form";
import { FaTimes } from 'react-icons/fa';
import { useRouter } from 'next/router';
import Modal from 'react-modal';

import api from '../../services/api';

import styles from './styles.module.scss';

export function SubscriptionModal({ isOpen, onRequestClose, data }) {
  const { query, push } = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const { id } = query;

  const priceFormatted = useMemo(() => {
    return (data.numbers.length * data.raffle?.ticket_price)
      .toLocaleString('pt-BR', {
        currency: 'BRL',
        style: 'currency'
      });
  }, [data])

  async function onSubmit(formData) {
    try {
      const response = await api.post('/bookings', {
        ...formData,
        numbers: data.numbers,
        raffle_id: id,
      })

      push(`/reserva/${response.data.uid}`)

      onRequestClose();
    } catch(err) {
      console.log(err)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className={styles.modal}
    > 
      <form onSubmit={handleSubmit(onSubmit)}>
        <header>
          <strong>Reserver o seu número</strong>

          <button type="button" onClick={onRequestClose}>
            <FaTimes />
          </button>
        </header>

        <main>
          <span>Deseja reservar o(s) número(s):</span>
          
          <div className={styles.numberContainer}>
            {data.numbers.map(number => (
              <div className={styles.number}>
                {number}
              </div>
            ))}
          </div>

          <div className={styles.price}>
            O valor da reserva é {priceFormatted}
          </div>

          <input type="hidden" {...register('numbers')} value={data.numbers.join(',')} />
        
          <input
            {...register('name', { required: true })}
            placeholder="Insira o seu nome completo"
          />

          <input
            {...register('phone', { required: true })}
            placeholder="Insira o seu telefone com ddd"
          />
    
        </main>

        <footer>
          <button type="button" className={styles.buttonCancel} onClick={onRequestClose}>
            Cancelar
          </button>

          <button className={styles.buttonSubmit}>
            Reservar
          </button>
        </footer>
      </form>
    </Modal>

  );
}