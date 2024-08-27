'use client';
import GraphiQLEditor from '@/components/graphiQLEditor/GraphiQLEditor';
import React from 'react';

const GraphiQL: React.FC = () => {
  const endpoint = 'https://your-graphql-endpoint.com/graphql'; // Замените на ваш GraphQL endpoint
  const body = ''; // Вы можете передать начальное тело запроса, если нужно

  return (
    <div>
      <h1>GraphiQL Interface</h1>
      <GraphiQLEditor endpoint={endpoint} body={body} />
    </div>
  );
};

export default GraphiQL;
