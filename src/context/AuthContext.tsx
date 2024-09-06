'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, fetchUserName } from '@/utils/firebase';
import { RoutePaths } from '@/constants/routePaths';
import { User } from 'firebase/auth';

type AuthContextProps = {
  user: User | null | undefined;
  name: string | null;
  loading: boolean;
  isLoading: boolean;
};

const privateRoutes = [
  RoutePaths.GRAPHIQL,
  RoutePaths.RESTFULL,
  RoutePaths.HISTORY,
];

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState<null | string>(null);
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchData = async () => {
      if (loading) return;
      if (!user) {
        if (
          privateRoutes.includes(pathname as RoutePaths) ||
          pathname.includes(RoutePaths.GRAPHIQL) ||
          pathname.includes('/RESTfull-client') ||
          pathname.startsWith(RoutePaths.HISTORY)
        )
          router.push(RoutePaths.WELCOME);
        setName(null);
        setIsLoading(false);
        return;
      }
      if (user) {
        const userName = await fetchUserName(user);
        setName(userName);
        if (pathname === RoutePaths.SIGNIN || pathname === RoutePaths.SIGNUP) {
          router.push(RoutePaths.WELCOME);
          setIsLoading(false);
          return;
        }

        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, loading, router, pathname]);

  return (
    <AuthContext.Provider value={{ user, loading, isLoading, name }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
