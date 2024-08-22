'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/utils/firebase';
import { query, collection, getDocs, where } from 'firebase/firestore';
import UIButton from '@/components/ui/UIButton';
import styles from './page.module.css';
import { useEffect, useState } from 'react';

export default function WelcomePage() {
  const [user, loading] = useAuthState(auth);
  const [name, setName] = useState('');

  const fetchUserName = async () => {
    try {
      const q = query(collection(db, 'users'), where('uid', '==', user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data.name);
    } catch (err) {
      console.error(err);
      alert('An error occured while fetching user data');
    }
  };
  useEffect(() => {
    if (loading) return;
    if (!user) return router.push('/');
    fetchUserName();
  }, [user, loading]);

  const router = useRouter();
  return (
    <>
      <h2>Welcome {name}</h2>
      <div className={styles.welcomeWrapper}>
        <UIButton text="Sign In" href="/auth/sign-in" />
        <UIButton text="Sign Up" href="/auth/sign-up" />
      </div>
    </>
  );
}
