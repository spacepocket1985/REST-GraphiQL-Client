import UIButton from '@/components/ui/UIButton';
import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';

export default function WelcomePage() {
  return (
    <>
      <h2>Welcome</h2>
      <div className={styles.welcomeWrapper}>
        <UIButton text="Sign In" href="/auth/sign-in" />
        <UIButton text="Sign Up" href="/auth/sign-up" />
      </div>
    </>
  );
}
