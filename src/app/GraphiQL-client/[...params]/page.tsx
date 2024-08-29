'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import GraphiQLEditor from '@/components/graphiQLEditor/GraphiQLEditor';

const GraphQLPage = () => {
  const searchParams = useSearchParams();
  const [headers, setHeaders] = useState({});
  const [endpoint, setEndpoint] = useState('');
  const [body, setBody] = useState('');

  useEffect(() => {
    const params = window.location.pathname.split('/').slice(-2);
    const [encodedEndpoint, encodedBody] = params;

    const decodedEndpoint = Buffer.from(encodedEndpoint, 'base64').toString(
      'utf-8'
    );
    const decodedBody = decodeURIComponent(
      Buffer.from(encodedBody, 'base64').toString('utf-8')
    );

    setEndpoint(decodedEndpoint);
    setBody(decodedBody);

    const headersObj = Object.fromEntries([...searchParams.entries()]);
    setHeaders(headersObj);
  }, [searchParams]);

  return (
    <div>
      <h1>GraphQL Request</h1>

      <div>{`endpoint - ${endpoint}`}</div>
      <div>{`body - ${body}`}</div>
      <div>{`headers - ${JSON.stringify(headers, null, 2)}`}</div>
      {
        <GraphiQLEditor
          paramEndpoint={endpoint}
          paramBody={body}
          paramHeaders={headers}
        />
      }
    </div>
  );
};

export default GraphQLPage;
