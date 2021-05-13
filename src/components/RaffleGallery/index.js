import "react-responsive-carousel/lib/styles/carousel.min.css"; 
import { Carousel } from 'react-responsive-carousel';

import styles from './styles.module.scss';

export function RaffleGallery ({ raffle }) {
  if (!raffle?.images.length) return null;

  return (
    <div className={styles.carouselContainer}>
      <Carousel
        showStatus={false}
      >
        {raffle.images.map(image => (
          <div key={image.url}>
            <img src={`${process.env.NEXT_PUBLIC_API_URL}${image.url}`} alt={raffle.name} />
          </div>
        ))}
      </Carousel>
    </div>
  );
}