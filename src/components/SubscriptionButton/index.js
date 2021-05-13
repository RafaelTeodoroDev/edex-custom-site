import { useMemo } from 'react';

import { FaMoneyBillWave, FaRegClock } from 'react-icons/fa';

import ReactTooltip from 'react-tooltip';
import styles from './styles.module.scss';

export function SubscriptionButton({ value, raffle, isSelected, isSubscribed, onClick }) {

  const isPaid = useMemo(() => {
    return isSubscribed?.booking.is_paid
  }, [isSubscribed])

  const tooltip = useMemo(() => {
    if (isSubscribed && isPaid) {
      return `Número ${value} pago por:\n\n ${isSubscribed?.booking.name}`;
    } 

    if (isSubscribed) {
      return `Número ${value} reservado por: ${isSubscribed?.booking.name}`;
    }
  }, [value, isSelected, isSubscribed, isPaid])

  return (
    <>
      <button
        type="button"
        data-tip={tooltip}
        className={`
          ${styles.subcriptionButton} 
          ${isSelected ? styles.selected : ''} 
          ${isSubscribed ? styles.subscribed : ''} 
          ${isPaid ? styles.paid : ''}
        `}
        key={String(`number-${raffle?.id}-${value}`)}
        onClick={() => !isSubscribed && onClick(value)}
      >
        {value}

        {isPaid && <FaMoneyBillWave />}
        {isSubscribed && !isPaid && <FaRegClock />}
      </button>

      <ReactTooltip />
    </>
  );
}