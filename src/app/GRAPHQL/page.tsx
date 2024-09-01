'use client';

import GraphiQLEditor from '@/components/graphiQLEditor/GraphiQLEditor';
import { Spinner } from '@/components/spinner/Spinner';
import { graphBase } from '@/constants/graphiQLData';
import { useAuth } from '@/context/AuthContext';
import React from 'react';
import { useTranslation } from 'react-i18next';

const GraphiQL: React.FC = () => {
  const { isLoading, user } = useAuth();
  const { t } = useTranslation();
  if (isLoading || !user) return <Spinner />;
  return (
    <div>
      <h1>{t('graphClient')}</h1>
      <GraphiQLEditor
        paramEndpoint={graphBase.url}
        paramQuery={graphBase.query}
        paramVariables={graphBase.variables}
      />
    </div>
  );
};

export default GraphiQL;
