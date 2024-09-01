'use client';

import { useEffect, useState } from 'react';
import { logout } from '@/utils/firebase';
import { RoutePaths } from '@/constants/routePaths';
import { UIButton } from '../ui/UIButton';
import styles from './Header.module.css';
import { UILink } from '../ui/UILink';
import { useAuth } from '@/context/AuthContext';
import LanguageToggle from '../languageToggle/LanguageToggle';
import { useTranslation } from 'react-i18next';

export default function Header() {
  const { user, isLoading } = useAuth();
  const { t } = useTranslation();
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
          <LanguageToggle />
          {user ? (
            <>
              <UIButton
                text={t('logOut')}
                onClick={logout}
                disabled={!!isLoading}
              />
            </>
          ) : (
            <>
              <UILink text={t('signIn')} href={RoutePaths.SIGNIN} />
              <UILink text={t('signUp')} href={RoutePaths.SIGNUP} />
            </>
          )}
          <UILink text={t('main')} href={RoutePaths.WELCOME} />
        </div>
      </div>
    </header>
  );
}
