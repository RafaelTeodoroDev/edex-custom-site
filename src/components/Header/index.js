import Link from 'next/link';

import styles from './styles.module.scss';

export function Header() {
  return (
    <header className={styles.header}>
      <Link href="/" passHref>
        <img src="/logo.png" alt="logo" />
      </Link>

      <nav className={styles.menu}>
        <Link href="/">
          <a>Home</a>
        </Link>
        
        <Link href="/sorteados">
          <a>Sorteados</a>
        </Link>
      </nav>
    </header>
  );
}