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
