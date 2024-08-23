'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, logout } from '@/utils/firebase';
import { RoutePaths } from '@/constants/routePaths';
import UIButton from '../ui/UIButton';
import styles from './Header.module.css';

export default function Header() {
  const [user] = useAuthState(auth);
  return (
    <header>
      <h2>Header</h2>
      <div className={styles.headerWrapper}>
        <UIButton text="Logo" href="" />
        <UIButton text="Language Toggle" href="" />
        {user ? (
          <UIButton
            text="Sign Out"
            href={RoutePaths.WELCOME}
            onClick={logout}
          />
        ) : (
          <UIButton text="Sign In" href={RoutePaths.SIGNIN} />
        )}

        <UIButton text="Welcome" href={RoutePaths.WELCOME} />
      </div>
    </header>
  );
}
