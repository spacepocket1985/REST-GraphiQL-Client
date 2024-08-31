'use client';

import { useEffect, useState } from 'react';
import { logout } from '@/utils/firebase';
import { RoutePaths } from '@/constants/routePaths';
import { UIButton } from '../ui/UIButton';
import styles from './Header.module.css';
import { UILink } from '../ui/UILink';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const { user, isLoading } = useAuth();
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
        <UIButton text="REST/Graph" />
        <div className={styles.menuWrapper}>
          <UIButton text="Language Toggle" />
          {user ? (
            <>
              <UIButton
                text="Sign Out"
                onClick={logout}
                disabled={!!isLoading}
              />
            </>
          ) : (
            <>
              <UILink text="Sign In" href={RoutePaths.SIGNIN} />
              <UILink text="Sign Up" href={RoutePaths.SIGNUP} />
            </>
          )}
          <UILink text="Welcome" href={RoutePaths.WELCOME} />
        </div>
      </div>
    </header>
  );
}
