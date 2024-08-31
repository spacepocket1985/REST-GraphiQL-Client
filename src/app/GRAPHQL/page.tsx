'use client';

import GraphiQLEditor from '@/components/graphiQLEditor/GraphiQLEditor';
import { Spinner } from '@/components/spinner/Spinner';
import { graphBase } from '@/constants/graphiQLData';
import { useAuth } from '@/context/AuthContext';
import React from 'react';

const GraphiQL: React.FC = () => {
  const { isLoading, user } = useAuth();
  if (isLoading || !user) return <Spinner />;
  return (
    <div>
      <h1>GraphiQL Client</h1>
      <GraphiQLEditor
        paramEndpoint={graphBase.url}
        paramQuery={graphBase.query}
        paramVariables={graphBase.variables}
      />
    </div>
  );
};

export default GraphiQL;
