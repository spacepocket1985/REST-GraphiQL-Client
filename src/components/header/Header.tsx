'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect, useState } from 'react';
import { auth, logout } from '@/utils/firebase';
import { RoutePaths } from '@/constants/routePaths';
import UIButton from '../ui/UIButton';
import styles from './Header.module.css';

export default function Header() {
  const [user] = useAuthState(auth);
  const [isScroll, setIsScroll] = useState(false);

  const handleScroll = () => {
    const offset = window.scrollY;
    if (offset > 20) {
      setIsScroll(true);
    } else {
      setIsScroll(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  return (
    <header
      className={`${styles['stickyHeader']} ${isScroll ? `${styles['opacity-70']} ${styles['transition-all']}` : ''}`}
    >
      <div className={styles.headerWrapper}>
        <UIButton text="Logo" href="" />
        <div className={styles.menuWrapper}>
          <UIButton text="Language Toggle" href="" />
          {user ? (
            <>
              <UIButton
                text="Sign Out"
                href={RoutePaths.WELCOME}
                onClick={logout}
              />
            </>
          ) : (
            <>
              <UIButton text="Sign In" href={RoutePaths.SIGNIN} />
              <UIButton text="Sign Up" href={RoutePaths.SIGNUP} />
            </>
          )}
          <UIButton text="Welcome" href={RoutePaths.WELCOME} />
        </div>
      </div>
    </header>
  );
}
