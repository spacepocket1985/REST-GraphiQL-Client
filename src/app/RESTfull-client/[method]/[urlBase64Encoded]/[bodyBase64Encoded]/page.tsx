'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { auth, fetchUserName } from '@/utils/firebase';

import styles from './page.module.css';

type ResponseState = {
  statusCode: number | string;
  body: string;
};

export default function RESTfullPage({
  params,
}: {
  params: {
    method: string;
    urlBase64Encoded: string;
    bodyBase64Encoded: string;
  };
}) {
  const [user, loading] = useAuthState(auth);
  const [, setName] = useState<null | string>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (loading) return;
      if (!user) {
        setName(null);
        return router.push('/');
      }
      const userName = await fetchUserName(user);
      setName(userName);
    };

    fetchData();
  }, [user, loading]);

  const router = useRouter();
  const searchParams = useSearchParams();

  //init decoded headers from URL
  const initHeaders = new Map<string, string>();
  searchParams.forEach((value, key) => {
    const decodedValue = decodeURIComponent(value);
    initHeaders.set(key, decodedValue);
  });

  //init decoded params from URL
  let initParamsDecoded: {
    method: string;
    endpoint: string;
    body: string;
  };
  try {
    const decodedEndpoint = atob(decodeURIComponent(params.urlBase64Encoded));
    const decodedBody = atob(decodeURIComponent(params.bodyBase64Encoded));

    initParamsDecoded = {
      method: params.method,
      endpoint: decodedEndpoint,
      body: decodedBody,
    };
  } catch (error) {
    console.error('Error decoded base64 data:', error);
    initParamsDecoded = {
      method: params.method,
      endpoint: ' ',
      body: ' ',
    };
  }

  const [method, setMethod] = useState(initParamsDecoded.method);
  const [endpoint, setEndpoint] = useState(initParamsDecoded.endpoint);
  const [requestBody, setRequestBody] = useState(initParamsDecoded.body);

  const [headers, setHeaders] = useState(initHeaders);
  const [response, setResponse] = useState<ResponseState>({
    statusCode: '',
    body: '{}',
  });

  useEffect(() => {
    updateRoute(
      method,
      endpoint || ' ',
      requestBody || ' ',
      Array.from(headers)
    );
  }, [method, endpoint, requestBody, headers]);

  const handleMethodChange = (selectedMethod: string) => {
    setMethod(selectedMethod);
  };

  const handleEndpointChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const url = event.target.value;
    setEndpoint(url);
  };

  const handleRequestBodyChange = (body: string) => {
    setRequestBody(body);
  };

  const handleHeaderChange = (
    key: string,
    newValue: string,
    index: number,
    isKeyChange: boolean
  ) => {
    const updatedHeadersArray = Array.from(headers);

    if (isKeyChange) {
      if (newValue.trim() !== '') {
        updatedHeadersArray[index] = [newValue, updatedHeadersArray[index][1]];
      } else {
        updatedHeadersArray.splice(index, 1);
      }
    } else {
      updatedHeadersArray[index] = [updatedHeadersArray[index][0], newValue];
    }

    setHeaders(new Map(updatedHeadersArray));
  };

  const addToLocalStorage = (
    method: string,
    endpoint: string,
    body: string,
    headers: [string, string][]
  ) => {
    const existingEntries = JSON.parse(
      localStorage.getItem('rest-data') || '[]'
    );

    const currentData = {
      method,
      endpoint,
      body,
      headers: Object.fromEntries(headers),
    };

    const updatedEntries = [...existingEntries, currentData];

    localStorage.setItem('rest-data', JSON.stringify(updatedEntries));
  };

  const updateRoute = (
    method: string,
    endpoint: string,
    body: string,
    headers: [string, string][]
  ) => {
    const encodedUrl = btoa(endpoint);
    const encodedBody = btoa(body);

    const queryParams = new URLSearchParams(
      headers.map(([key, value]) => [key, encodeURIComponent(value)])
    ).toString();

    const href = `/RESTfull-client/${method}/${encodedUrl}${body ? `/${encodedBody}` : ''}?${queryParams}`;

    router.replace(href, undefined);
  };

  const sendRequest = async () => {
    try {
      const response = await fetch(endpoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          ...Object.fromEntries(headers),
        },
        body:
          method !== 'GET' && method !== 'DELETE'
            ? JSON.stringify(JSON.parse(requestBody))
            : undefined,
      });

      const responseBody = await response.text();
      setResponse({
        statusCode: response.status,
        body: responseBody
          ? JSON.stringify(JSON.parse(responseBody), null, 2)
          : '',
      });
      addToLocalStorage(method, endpoint, requestBody, Array.from(headers));
      updateRoute(method, endpoint, requestBody, Array.from(headers));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'An unknown error occurred';
      setResponse({
        statusCode: 'error',
        body: message,
      });
    }
  };

  return (
    <>
      <div className={styles.RESTWrapper}>
        <>
          <div>
            <h3 className={styles.wrapperSubTitle}>REST Client</h3>

            <section>
              <div>
                <label>Method: </label>
                <select
                  onChange={(e) => handleMethodChange(e.target.value)}
                  value={method}
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="PATCH">PATCH</option>
                  <option value="DELETE">DELETE</option>
                </select>
              </div>
              <div>
                <label>Endpoint URL:</label>
                <input
                  type="text"
                  onChange={handleEndpointChange}
                  value={endpoint}
                />
              </div>
              {/* Headers editor */}
              <div>
                {Array.from(headers).map(([key, value], index) => (
                  <div key={index}>
                    <input
                      type="text"
                      placeholder="Header Key"
                      value={key}
                      onChange={(e) => {
                        handleHeaderChange(key, e.target.value, index, true);
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Header Value"
                      value={value}
                      onChange={(e) =>
                        handleHeaderChange(key, e.target.value, index, false)
                      }
                    />
                    <button
                      onClick={() => {
                        const updatedPairs = new Map(headers);
                        updatedPairs.delete(key);
                        setHeaders(updatedPairs);
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => setHeaders(new Map(headers).set('', ''))}
                >
                  Add Header
                </button>
              </div>

              {/* Request Body editor */}
              <div>
                <label>Body: </label>
                <textarea
                  value={requestBody}
                  className={`${styles.RESTTextarea} ${styles.bodytextarea}`}
                  onChange={(e) => handleRequestBodyChange(e.target.value)}
                  disabled={method === 'GET' || method === 'DELETE'}
                />
              </div>

              <button onClick={sendRequest}>Send Request</button>
            </section>
            <section>
              <p>Status: {response.statusCode}</p>
              <textarea
                readOnly
                className={styles.RESTTextarea}
                value={response.body}
              />
            </section>
          </div>
        </>
      </div>
    </>
  );
}
