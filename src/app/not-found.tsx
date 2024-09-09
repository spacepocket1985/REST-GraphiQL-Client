'use client';

import { useTranslation } from 'react-i18next';
import React from 'react';

const NotFound: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <h2>404</h2>
      <h3>{t('notFound')}</h3>
    </>
  );
};

export default NotFound;
