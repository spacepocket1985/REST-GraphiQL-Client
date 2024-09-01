'use client';
import { allExpanded, defaultStyles, JsonView } from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import styles from './page.module.css';
import { UIButton } from '@/components/ui/UIButton';
import { Spinner } from '@/components/spinner/Spinner';
import { useAuth } from '@/context/AuthContext';

export default function RESTfullPage({
  params,
}: {
  params: {
    method: string;
    urlBase64Encoded: string;
    bodyBase64Encoded: string;
  };
}) {
  const { isLoading } = useAuth();

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
  const [response, setResponse] = useState('{}');
  const [statusCode, setStatusCode] = useState(' ');

  if (isLoading) return <Spinner />;

  const handleMethodChange = (selectedMethod: string) => {
    setMethod(selectedMethod);
    updateRoute(selectedMethod, endpoint, requestBody, Array.from(headers));
  };

  const handleEndpointChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const url = event.target.value;

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

  const createHref = (
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
    return href;
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

    const currentData = createHref(method, endpoint, body, headers);

    const updatedEntries = [...existingEntries, currentData];

    localStorage.setItem('rest-data', JSON.stringify(updatedEntries));
  };

  const updateRoute = (
    method: string,
    endpoint: string,
    body: string,
    headers: [string, string][]
  ) => {
    router.replace(createHref(method, endpoint, body, headers), undefined);
  };

  const sendRequest = async () => {
    const filteredHeaders = Array.from(headers)
      .filter(([key]) => key.trim() !== '')
      .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

    try {
      const responseFetch = await fetch(endpoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          ...filteredHeaders,
        },
        body:
          method !== 'GET' &&
          method !== 'DELETE' &&
          method !== 'HEAD' &&
          method !== 'OPTIONS'
            ? JSON.stringify(JSON.parse(requestBody))
            : undefined,
      });

      let jsonResponse;
      if (method !== 'HEAD' && method !== 'OPTIONS') {
        jsonResponse = await responseFetch.json();
      }
      setResponse(jsonResponse);
      if (!responseFetch.ok) {
        const errorCode = jsonResponse.error?.code || responseFetch.status;
        setStatusCode(errorCode);
      } else {
        setStatusCode(responseFetch.status.toString());
      }

      updateRoute(method, endpoint, requestBody, Array.from(headers));
      addToLocalStorage(method, endpoint, requestBody, Array.from(headers));
    } catch (error) {
      console.error(error);
      const message =
        error instanceof Error ? error.message : 'An unknown error occurred';
      setResponse(message);
      setStatusCode(`error`);
    }
  };

  return (
    <>
      <div className={styles.RESTWrapper}>
        <h1 className={styles.wrapperSubTitle}>REST Client</h1>

        <section>
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
            <option value="HEAD">HEAD</option>
            <option value="OPTIONS">OPTIONS</option>
          </select>
        </section>
        <section>
          <label>Endpoint URL:</label>
          <input type="text" onChange={handleEndpointChange} value={endpoint} />
        </section>
        {/* Headers editor */}
        <section>
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
                  updateRoute(
                    method,
                    endpoint,
                    requestBody,
                    Array.from(updatedPairs)
                  );
                }}
              >
                Remove
              </UIButton>
            </div>
          ))}
          <UIButton onClick={() => setHeaders(new Map(headers).set('', ''))}>
            Add Header
          </UIButton>
        </section>
        {/* Request Body editor */}
        <section className={styles.requestBodyStyle}>
          <label>Body: </label>
          <textarea
            value={requestBody}
            className={`${styles.RESTTextarea} ${styles.bodytextarea}`}
            onChange={(e) => handleRequestBodyChange(e.target.value)}
            onBlur={handleRequestBodyBlur}
            disabled={
              method === 'GET' ||
              method === 'DELETE' ||
              method === 'HEAD' ||
              method == 'OPTIONS'
            }
          />
        </section>
        <section>
          <UIButton onClick={sendRequest} disabled={endpoint === ' '}>
            Send Request
          </UIButton>
        </section>

        {/* Response */}

        <section className={styles.RestResponceSection}>
          <h3 className={styles.RestTitleSection}>Response:</h3>
          <p>Status: {statusCode}</p>
          <div className={styles.response}>
            <JsonView
              data={response}
              shouldExpandNode={allExpanded}
              style={defaultStyles}
            />
          </div>
        </section>
      </div>
    </>
  );
}
