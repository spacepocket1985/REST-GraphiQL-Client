'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, fetchUserName } from '@/utils/firebase';

import styles from './page.module.css';

type ResponseState = {
  statusCode: number | null;
  body: string;
};

export default function RESTfullPage() {
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
  const [method, setMethod] = useState('GET');
  const [endpoint, setEndpoint] = useState('');
  const [requestBody, setRequestBody] = useState('{}');
  const [headers, setHeaders] = useState<{ [key: string]: string }>({});
  const [response, setResponse] = useState<ResponseState>({
    statusCode: null,
    body: '{}',
  });

  const handleMethodChange = (selectedMethod: string) => {
    setMethod(selectedMethod);
    // updateRoute(selectedMethod, endpoint, requestBody, headers);
  };

  const handleEndpointChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const url = event.target.value;
    setEndpoint(url);
    // updateRoute(method, url, requestBody, headers);
  };

  const handleRequestBodyChange = (body: string) => {
    setRequestBody(body);
    // updateRoute(method, endpoint, body, headers);
  };

  const handleHeaderChange = (key: string, value: string) => {
    const updatedHeaders = { ...headers, [key]: value };
    console.log('update headers', updatedHeaders);

    setHeaders(updatedHeaders);
    // updateRoute(method, endpoint, requestBody, updatedHeaders);
  };
  /* 
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

    router.push(
      `/${method}/${encodedUrl}${body ? `/${encodedBody}` : ''}?${queryParams}`
    );
  };
 */
  const sendRequest = async () => {
    try {
      const response = await fetch(endpoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          ...headers,
        },
        body:
          method !== 'GET'
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
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'An unknown error occurred';
      setResponse({
        statusCode: -1,
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
                <label>Method:</label>
                <select
                  onChange={(e) => handleMethodChange(e.target.value)}
                  value={method}
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  {/* Add other methods as needed */}
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
                <label>Body:</label>
                <textarea
                  value={requestBody}
                  onChange={(e) => handleRequestBodyChange(e.target.value)}
                  disabled={method === 'GET'}
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
