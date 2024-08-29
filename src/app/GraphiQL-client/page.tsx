'use client';

import GraphiQLEditor from '@/components/graphiQLEditor/GraphiQLEditor';
import React from 'react';

const GraphiQL: React.FC = () => {
  const endpoint = '';
  const body = '';

  return (
    <div>
      <h1>GraphiQL Interface</h1>
      <GraphiQLEditor
        paramEndpoint={endpoint}
        paramBody={body}
        paramHeaders={{}}
      />
    </div>
  );
};

export default GraphiQL;
