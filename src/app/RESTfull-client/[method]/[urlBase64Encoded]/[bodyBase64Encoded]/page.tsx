'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
  console.log(params);

  const initParamsDecoded = {
    method: params.method,
    endpoint: atob(decodeURIComponent(params.urlBase64Encoded)),
    body: atob(decodeURIComponent(params.bodyBase64Encoded)),
  };

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
  const [method, setMethod] = useState(initParamsDecoded.method);
  const [endpoint, setEndpoint] = useState(initParamsDecoded.endpoint);
  const [requestBody, setRequestBody] = useState(initParamsDecoded.body);
  const [headers, setHeaders] = useState<{ [key: string]: string }>({});
  const [response, setResponse] = useState<ResponseState>({
    statusCode: '',
    body: '{}',
  });

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

  const handleHeaderChange = (key: string, value: string) => {
    const updatedHeaders = { ...headers, [key]: value };

    setHeaders(updatedHeaders);
  };

  const addToLocalStorage = (
    method: string,
    endpoint: string,
    body: string,
    headers: { [key: string]: string }
  ) => {
    const existingEntries = JSON.parse(
      localStorage.getItem('rest-data') || '[]'
    );

    const currentData = {
      method,
      endpoint,
      body,
      headers,
    };

    const updatedEntries = [...existingEntries, currentData];

    localStorage.setItem('rest-data', JSON.stringify(updatedEntries));
  };

  const updateRoute = (
    method: string,
    endpoint: string,
    body: string,
    headers: { [key: string]: string }
  ) => {
    const encodedUrl = btoa(endpoint);
    const encodedBody = btoa(body);
    const queryParams = new URLSearchParams(
      Object.entries(headers).map(([key, value]) => [
        key,
        encodeURIComponent(value),
      ])
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
          ...headers,
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
      // update url only visualy
      addToLocalStorage(method, endpoint, requestBody, headers);
      updateRoute(method, endpoint, requestBody, headers);
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
                {Object.entries(headers).map(([key, value], index) => (
                  <div key={index}>
                    <input
                      type="text"
                      placeholder="Header Key"
                      value={key}
                      onChange={(e) => {
                        const newHeaders = { ...headers };
                        delete newHeaders[key]; // Remove old key
                        setHeaders({
                          ...newHeaders,
                          [e.target.value]: value,
                        }); // Add new key
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Header Value"
                      value={value}
                      onChange={(e) => handleHeaderChange(key, e.target.value)}
                    />
                    <button
                      onClick={() => {
                        const newHeaders = { ...headers };
                        delete newHeaders[key];
                        setHeaders(newHeaders);
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button onClick={() => setHeaders({ ...headers, '': '' })}>
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

            <p>REST</p>
          </div>
        </>
      </div>
    </>
  );
}
