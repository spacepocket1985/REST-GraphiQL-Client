'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import styles from './page.module.css';
import { UIButton } from '@/components/ui/UIButton';

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

  const handleMethodChange = (selectedMethod: string) => {
    setMethod(selectedMethod);
    updateRoute(selectedMethod, endpoint, requestBody, Array.from(headers));
  };

  const handleEndpointChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const url = event.target.value;
    console.log('!!! endpoint ', endpoint);

    setEndpoint(url);
    updateRoute(method, url || ' ', requestBody, Array.from(headers));
  };

  const handleRequestBodyChange = (body: string) => {
    setRequestBody(body);
  };

  const handleRequestBodyBlur = () => {
    updateRoute(method, endpoint, requestBody || ' ', Array.from(headers));
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
    updateRoute(method, endpoint, requestBody, updatedHeadersArray);
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
    const filteredHeaders = Array.from(headers)
      .filter(([key]) => key.trim() !== '')
      .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

    try {
      const response = await fetch(endpoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          ...filteredHeaders,
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
      console.error(error);
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
                    <UIButton
                      onClick={() => {
                        const updatedPairs = new Map(headers);
                        updatedPairs.delete(key);
                        setHeaders(updatedPairs);
                      }}
                    >
                      Remove
                    </UIButton>
                  </div>
                ))}
                <UIButton
                  onClick={() => setHeaders(new Map(headers).set('', ''))}
                >
                  Add Header
                </UIButton>
              </div>

              {/* Request Body editor */}
              <div>
                <label>Body: </label>
                <textarea
                  value={requestBody}
                  className={`${styles.RESTTextarea} ${styles.bodytextarea}`}
                  onChange={(e) => handleRequestBodyChange(e.target.value)}
                  onBlur={handleRequestBodyBlur}
                  disabled={method === 'GET' || method === 'DELETE'}
                />
              </div>

              <UIButton onClick={sendRequest} disabled={endpoint === ' '}>
                Send Request
              </UIButton>
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
