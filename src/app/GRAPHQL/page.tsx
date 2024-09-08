'use client';

import React, { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import GraphiQLEditor from '@/components/graphiQLEditor/GraphiQLEditor';
import { Spinner } from '@/components/spinner/Spinner';
import { graphBase } from '@/constants/graphiQLData';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';

const GraphiQL: React.FC = () => {
  const { isLoading, user } = useAuth();
  const { t } = useTranslation();
  const toastShownRef = useRef(false);

  useEffect(() => {
    if (user && !toastShownRef.current) {
      toast.info(t('graphStartPageinfo'), {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      toastShownRef.current = true;
    }
  }, [user]);

  if (isLoading || !user) return <Spinner />;

  return (
    <div>
      <h1>{t('graphClient')}</h1>
      <GraphiQLEditor
        paramEndpoint={graphBase.url}
        paramQuery={graphBase.query}
        paramVariables={graphBase.variables}
        paramHeaders={graphBase.headers}
      />
    </div>
  );
};

export default GraphiQL;
