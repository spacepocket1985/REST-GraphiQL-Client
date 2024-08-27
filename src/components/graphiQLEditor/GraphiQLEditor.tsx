'use client';

import CodeMirror, { EditorView } from '@uiw/react-codemirror';
import React, { useState } from 'react';

import { JSONTree } from 'react-json-tree';
import { UIButton } from '../ui/UIButton';

import styles from './GraphiQLEditor.module.css';

export interface Props {
  endpoint: string;
  body: string;
}

const GraphiQLPage: React.FC<Props> = () => {
  const [endpoint, setEndpoint] = useState<string>(
    'https://countries.trevorblades.com/'
  );
  const [sdlUrl, setSdlUrl] = useState<string>('');
  const [query, setQuery] = useState<string>('');
  const [variables, setVariables] = useState<string>('');
  const [headers, setHeaders] = useState<{ key: string; value: string }[]>([
    { key: '', value: '' },
  ]);
  const [response, setResponse] = useState<Record<string, unknown> | null>(
    null
  );
  const [statusCode, setStatusCode] = useState<number | null>(null);

  const [isQueryVisible, setIsQueryVisible] = useState(true);
  const [isHeadersVisible, setIsHeadersVisible] = useState(true);
  const [isVariablesVisible, setIsVariablesVisible] = useState(true);

  const addHeader = () => {
    setHeaders([...headers, { key: '', value: '' }]);
  };

  const theme = {
    scheme: 'monokai',
    author: 'w0ng',
    base00: '#272822',
    base01: '#383830',
    base02: '#49483e',
    base03: '#75715e',
    base04: '#f8f8f2',
    base05: '#f8f8f2',
    base06: '#f8f8f2',
    base07: '#f8f8f2',
    base08: '#f92672',
    base09: '#fd971f',
    base0A: '#f4bf75',
    base0B: '#a6e22e',
    base0C: '#a1efe4',
    base0D: '#66d9ef',
    base0E: '#ae81ff',
    base0F: '#cc6633',
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
    } catch (error) {
      console.error('Error during fetch:', error);
      if (error instanceof Error) setResponse({ error: error.message });
      setStatusCode(null);
    }
  };

  const handleDelHeader = (index: number) => {
    setHeaders(headers.filter((_, itemIndex) => itemIndex !== index));
  };

  return (
    <div className={styles.editorWrapper}>
      <section>
        <div>
          <input
            type="text"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            placeholder="Endpoint URL"
            className={styles.editorInput}
          />
        </div>
        <div>
          <input
            type="text"
            value={sdlUrl}
            onChange={(e) => setSdlUrl(e.target.value)}
            placeholder="SDL URL"
            className={styles.editorInput}
          />
        </div>
      </section>
      <section>
        <div className={styles.headerLine}>
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
        <h3
          onClick={() => setIsQueryVisible(!isQueryVisible)}
          className={styles.sectionTitle}
        >
          Query {isQueryVisible ? '[show]' : '[hide]'}
        </h3>
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
      <UIButton onClick={handleRequest}>Send</UIButton>
      <section>
        <h3 className={styles.sectionTitle}>Response:</h3>
        <p>Status: {statusCode}</p>
        {response && <JSONTree data={response} theme={theme} />}
      </section>
    </div>
  );
};

export default GraphiQLPage;
