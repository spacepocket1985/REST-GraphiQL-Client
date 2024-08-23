'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, fetchUserName } from '@/utils/firebase';
import UIButton from '@/components/ui/UIButton';

import styles from './page.module.css';

export default function WelcomePage() {
  const [user, loading] = useAuthState(auth);
  const [name, setName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (loading) return;
      if (!user) {
        setName('');
        return router.push('/');
      }
      const userName = await fetchUserName(user);
      setName(userName);
    };

    fetchData();
  }, [user, loading]);

  const router = useRouter();
  return (
    <>
      <h2>{user ? `Welcome Back, ${name}!` : 'Welcome!'}</h2>
      <div className={styles.welcomeWrapper}>
        <UIButton text="Sign In" href="/auth/sign-in" />
        <UIButton text="Sign Up" href="/auth/sign-up" />
      </div>
    </>
  );
}
