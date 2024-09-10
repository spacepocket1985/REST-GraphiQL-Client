'use client';

import { AuthProvider } from '@/context/AuthContext';
import '@/utils/i18n';

export const Providers: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <AuthProvider>{children}</AuthProvider>;
};
