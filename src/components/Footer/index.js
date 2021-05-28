import { FaInstagram } from 'react-icons/fa';
import styles from './styles.module.scss';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <a href="https://www.instagram.com/edexcustom/" title="Siga a gente no instagram">
        <FaInstagram />
      </a>

      <span>&copy; EdexCustom - Todos os direitos reservados - 2020 - 2021</span>
    </footer>
  );
}
