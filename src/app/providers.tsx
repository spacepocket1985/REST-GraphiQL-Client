'use client';

import { AuthProvider } from '@/context/AuthContext';

export const Providers: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <AuthProvider>{children}</AuthProvider>;
};
