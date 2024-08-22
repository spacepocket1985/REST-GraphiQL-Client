'use client';

import UIButton from '../ui/UIButton';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header>
      <h2>Header</h2>
      <div className={styles.headerWrapper}>
        <UIButton text="Logo [Welcome]" href="/" />
        <div>Language Toggle</div>
        <UIButton text="Sign In" href="/auth/sign-in" />

        <div>{new Date().getFullYear()}</div>
      </div>
    </header>
  );
}
