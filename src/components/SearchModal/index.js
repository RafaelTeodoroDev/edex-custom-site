import { useForm } from "react-hook-form";
import { FaTimes } from 'react-icons/fa';
import { useRouter } from 'next/router';
import Modal from 'react-modal';

import { InputPhone } from '../InputPhone';

import api from '../../services/api';

import styles from './styles.module.scss';

export function SearchModal({ isOpen, onRequestClose, data }) {
  const { query, push } = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const { id } = query;

  async function onSubmit(formData) {
    try {
      const response = await api.get('/bookings/search', { params: {
        phone: formData.phone,
        raffle_id: id
      } })

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
          <span>Consulte sua reserva</span>

          <div className={styles.info}>
            Preencha o número do seu telefone para consultar sua reserva neste sorteio.
          </div>

          <InputPhone
            {...register('phone', { required: true })}
            placeholder="Insira o seu telefone com ddd"
          />
    
        </main>

        <footer>
          <button type="button" className={styles.buttonCancel} onClick={onRequestClose}>
            Cancelar
          </button>

          <button className={styles.buttonSubmit}>
            Consultar
          </button>
        </footer>
      </form>
    </Modal>

  );
}