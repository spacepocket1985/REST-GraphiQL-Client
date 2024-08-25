'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, fetchUserName } from '@/utils/firebase';

import styles from './page.module.css';
import UIButton from '@/components/ui/UIButton';
import { RoutePaths } from '@/constants/routePaths';

export default function WelcomePage() {
  const [user, loading] = useAuthState(auth);
  const [name, setName] = useState<null | string>(null);

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
      <div className={styles.welcomeWrapper}>
        <h2>{name ? `Welcome Back, ${name}!` : 'Welcome!'}</h2>
        {user ? (
          <>
            <div className="welcomeSection">
              <h3 className={styles.wrapperSubTitle}>
                Available utilities and features
              </h3>
              <div className={styles.welcomeTools}>
                <UIButton text="REST Client" href={RoutePaths.RESTFULL} />
                <UIButton text="GraphiQL Client" href="" />
                <UIButton text="History" href="" />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="welcomeSection">
              <h3 className={styles.wrapperSubTitle}>Info about task</h3>
              <p>
                lightweight application that combines the functionalities of two
                leading API clients: Postman and GraphiQL. It is designed for
                developers working with both REST and GraphQL APIs, providing an
                intuitive interface for creating, testing, and documenting
                requests.
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
}
