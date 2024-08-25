'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, fetchUserName } from '@/utils/firebase';

import styles from './page.module.css';

export default function RESTfullPage() {
  const [user, loading] = useAuthState(auth);
  const [, setName] = useState<null | string>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (loading) return;
      if (!user) {
        setName(null);
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
      <div className={styles.RESTWrapper}>
        <>
          <div>
            <h3 className={styles.wrapperSubTitle}>REST Client</h3>
            <p>REST</p>
          </div>
        </>
      </div>
    </>
  );
}
