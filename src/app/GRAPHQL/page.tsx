'use client';

import GraphiQLEditor from '@/components/graphiQLEditor/GraphiQLEditor';
import { graphBase } from '@/constants/graphiQLData';
import React from 'react';

const GraphiQL: React.FC = () => {
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
