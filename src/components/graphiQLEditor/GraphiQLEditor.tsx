'use client';

import { jsonTreeTheme } from '@/constants/jsonTreeTheme';
import gqlPrettier from 'graphql-prettier';
import CodeMirror, { EditorView } from '@uiw/react-codemirror';
import React, { useState } from 'react';

import { JSONTree, KeyPath } from 'react-json-tree';
import { UIButton } from '../ui/UIButton';

import { onError } from '@/utils/firebase';
import styles from './GraphiQLEditor.module.css';
import {
  graphBaseQuery,
  graphBaseURL,
  shemaQuery,
} from '@/constants/graphiQLData';

export interface Props {
  endpoint: string;
  body: string;
}

const GraphiQLPage: React.FC<Props> = () => {
  const [endpoint, setEndpoint] = useState<string>(graphBaseURL);
  const [sdlUrl, setSdlUrl] = useState<string>(`${endpoint}?sdl`);
  const [query, setQuery] = useState<string>(graphBaseQuery);

  const [variables, setVariables] = useState<string>('');
  const [headers, setHeaders] = useState<{ key: string; value: string }[]>([
    { key: '', value: '' },
  ]);
  const [response, setResponse] = useState<Record<string, unknown> | null>(
    null
  );
  const [sdlDocs, setSdlDocs] = useState<Record<string, unknown> | null>(null);
  const [statusCode, setStatusCode] = useState<number | null>(null);

  const [isQueryVisible, setIsQueryVisible] = useState(true);
  const [isHeadersVisible, setIsHeadersVisible] = useState(true);
  const [isVariablesVisible, setIsVariablesVisible] = useState(true);

  const addHeader = () => {
    setHeaders([...headers, { key: '', value: '' }]);
  };

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

      setStatusCode(res.status);
      const jsonResponse = await res.json();
      setResponse(jsonResponse);
      if (res.ok) {
        fetchGraphQLSchema()
          .then((schema) => {
            setSdlDocs(schema);
          })
          .catch((error) => {
            console.error('Error fetching schema:', error);
            setSdlDocs(null);
          });
      }
    } catch (error) {
      if (error instanceof Error) setResponse({ error: error.message });
      setStatusCode(null);
    }
  };

  const handleDelHeader = (index: number) => {
    setHeaders(headers.filter((_, itemIndex) => itemIndex !== index));
  };
  const shouldExpandNodeInitially = (
    keyPath: KeyPath,
    data: unknown,
    level: number
  ): boolean => {
    if (data) {
      console.log(Number(keyPath) + level);
    }
    return true;
  };

  async function fetchGraphQLSchema() {
    const response = await fetch(sdlUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ shemaQuery }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }

    const { data } = await response.json();
    return data;
  }

  const handlePrettify = () => {
    try {
      const prettifiedQuery = gqlPrettier(query);

      setQuery(prettifiedQuery);
    } catch (error) {
      if (error instanceof Error) onError(error);
    }
  };

  return (
    <div className={styles.editorWrapper}>
      <section>
        <div className={styles.urlLine}>
          <input
            type="text"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            placeholder="Endpoint URL"
            className={styles.editorInput}
          />
          <p className={styles.url}>URL</p>
        </div>
        <div className={styles.urlLine}>
          <input
            type="text"
            value={sdlUrl}
            onChange={(e) => setSdlUrl(e.target.value)}
            placeholder="SDL URL"
            className={styles.editorInput}
          />
          <p className={styles.url}>SDL</p>
        </div>
      </section>
      <section>
        <div className={styles.titleLine}>
          <h3
            onClick={() => setIsHeadersVisible(!isHeadersVisible)}
            className={styles.sectionTitle}
          >
            Headers {isHeadersVisible ? '[show]' : '[hide]'}
          </h3>
          <UIButton onClick={addHeader}>Add Header</UIButton>
        </div>
        <section></section>
        {isHeadersVisible && (
          <>
            {headers.map((header, index) => (
              <div key={index} className={styles.headerWrapper}>
                <input
                  type="text"
                  placeholder="Header Key"
                  value={header.key}
                  onChange={(e) => {
                    const newHeaders = [...headers];
                    newHeaders[index].key = e.target.value;
                    setHeaders(newHeaders);
                  }}
                />
                <input
                  type="text"
                  placeholder="Header Value"
                  value={header.value}
                  onChange={(e) => {
                    const newHeaders = [...headers];
                    newHeaders[index].value = e.target.value;
                    setHeaders(newHeaders);
                  }}
                />
                <UIButton
                  className={styles.btnDel}
                  onClick={() => {
                    handleDelHeader(index);
                  }}
                >
                  x
                </UIButton>
              </div>
            ))}
          </>
        )}
      </section>

      <section>
        <div className={styles.titleLine}>
          <h3
            onClick={() => setIsQueryVisible(!isQueryVisible)}
            className={styles.sectionTitle}
          >
            Query {isQueryVisible ? '[show]' : '[hide]'}
          </h3>
          <UIButton onClick={handlePrettify}>Prettify </UIButton>
        </div>
        {isQueryVisible && (
          <CodeMirror
            className={styles.myCodeMirror}
            style={{
              textAlign: 'start',
              whiteSpace: 'pre-wrap',
              wordBreak: 'normal',
              wordWrap: 'break-word',
            }}
            value={query}
            extensions={[EditorView.lineWrapping]}
            onChange={(newValue) => setQuery(newValue)}
            basicSetup={{
              highlightActiveLine: true,
              autocompletion: true,
              foldGutter: true,
              dropCursor: true,
              allowMultipleSelections: true,
              indentOnInput: true,
              bracketMatching: true,
              closeBrackets: true,
              lintKeymap: true,
            }}
            width="auto"
            minHeight="10rem"
          />
        )}
      </section>
      <section>
        <h3
          onClick={() => setIsVariablesVisible(!isVariablesVisible)}
          className={styles.sectionTitle}
        >
          Variables {isVariablesVisible ? '[show]' : '[hide]'}
        </h3>
        {isVariablesVisible && (
          <CodeMirror
            className={styles.myCodeMirror}
            style={{
              textAlign: 'start',
              whiteSpace: 'pre-wrap',
              wordBreak: 'normal',
              wordWrap: 'break-word',
            }}
            value={variables}
            extensions={[EditorView.lineWrapping]}
            onChange={(newValue) => setVariables(newValue)}
            basicSetup={{
              highlightActiveLine: true,
              autocompletion: true,
              foldGutter: true,
              dropCursor: true,
              allowMultipleSelections: true,
              indentOnInput: true,
              bracketMatching: true,
              closeBrackets: true,
              lintKeymap: true,
            }}
            width="auto"
            minHeight="10rem"
          />
        )}
      </section>
      <UIButton onClick={handleRequest}>Send request</UIButton>
      <section>
        <div className={styles.titleLine}>
          <h3 className={styles.sectionTitle}>Response:</h3>
          <p className={styles.status}>Status: {statusCode}</p>
        </div>

        <div className={styles.response}>
          {response && (
            <JSONTree
              data={response}
              theme={jsonTreeTheme}
              shouldExpandNodeInitially={shouldExpandNodeInitially}
            />
          )}
        </div>
      </section>
      <section>
        <h3 className={styles.sectionTitle}>SDL Docs:</h3>
        <div className={styles.response}>
          {sdlDocs && (
            <JSONTree
              data={sdlDocs}
              theme={jsonTreeTheme}
              shouldExpandNodeInitially={shouldExpandNodeInitially}
            />
          )}
        </div>
      </section>
    </div>
  );
};

export default GraphiQLPage;
