'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import GraphiQLEditor from '@/components/graphiQLEditor/GraphiQLEditor';
import styles from './page.module.css';
import { useAuth } from '@/context/AuthContext';
import { Spinner } from '@/components/spinner/Spinner';
import { onError } from '@/utils/firebase';
import { add2LocalStorage } from '@/utils/add2LocalStorage';

const GraphQLPage = () => {
  const searchParams = useSearchParams();

  const [headers, setHeaders] = useState<{ key: string; value: string }[]>([
    { key: '', value: '' },
  ]);
  const [endpoint, setEndpoint] = useState('');
  const [query, setQuery] = useState<string>('');
  const [variables, setVariables] = useState<string>('');
  const [response, setResponse] = useState<Record<string, unknown> | null>(
    null
  );

  const [statusCode, setStatusCode] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { user, isLoading: loading } = useAuth();
  useEffect(() => {
    const params = window.location.pathname.split('/').slice(-2);

    const [encodedEndpoint, encodedBody] = params;

    try {
      const decodedEndpoint = Buffer.from(encodedEndpoint, 'base64').toString(
        'utf-8'
      );
      setEndpoint(decodedEndpoint);
    } catch (error) {
      if (error instanceof Error) {
        setEndpoint(Buffer.from('').toString('base64'));
        onError(error);
      }
    }

    try {
      const decodedBody = decodeURIComponent(
        Buffer.from(encodedBody, 'base64').toString('utf-8')
      );

      const bodyJson = JSON.parse(decodedBody);
      setQuery(bodyJson.query || '');
      setVariables(bodyJson.variables || '');
    } catch (error) {
      setQuery('');
      setVariables('');
      if (error instanceof Error) {
        onError(error);
      }
    }

    const headersObj = Object.fromEntries([...searchParams.entries()]);
    const headersArray = Object.entries(headersObj).map(([key, value]) => ({
      key,
      value,
    }));
    setHeaders(headersArray);
  }, [searchParams]);

  useEffect(() => {
    if (endpoint) {
      handleRequest();
      if (!searchParams.get('fromHistory')) {
        add2LocalStorage(window.location.pathname);
      }
      if (searchParams.get('fromHistory')) {
        setHeaders(headers.filter((item) => item.key !== 'fromHistory'));
      }
    }
  }, [endpoint]);

  const handleRequest = async () => {
    const headersObj = Object.fromEntries(
      headers
        .filter((header) => header.key.trim() !== '')
        .map((header) => [header.key, header.value])
    );
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headersObj,
        },
        body: JSON.stringify({
          query,
          variables: JSON.parse(variables || '{}'),
        }),
      });

      const jsonResponse = await res.json();
      setResponse(jsonResponse);
      if (!res.ok) {
        const errorCode = jsonResponse.error?.code || res.status;
        setStatusCode(errorCode);
      } else {
        setStatusCode(res.status);
      }
    } catch (error) {
      if (error instanceof Error) setResponse({ error: error.message });
      setStatusCode(500);
    } finally {
      setIsLoading(false);
    }
  };
  if (loading || !user) return <Spinner />;
  return (
    <div className={styles.wrapper}>
      <h1>GraphiQL Client</h1>

      {
        <GraphiQLEditor
          paramEndpoint={endpoint}
          paramVariables={variables}
          paramHeaders={headers}
          paramQuery={query}
          statusCode={statusCode}
          response={response}
          isLoading={isLoading}
        />
      }
    </div>
  );
};

export default GraphQLPage;
