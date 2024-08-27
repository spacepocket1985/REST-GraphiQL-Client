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
  const [endpoint, setEndpoint] = useState('');
  const [sdlUrl, setSdlUrl] = useState('');
  const [query, setQuery] = useState('');
  const [variables, setVariables] = useState('');
  const [headers, setHeaders] = useState([{ key: '', value: '' }]);
  const [response, setResponse] = useState<unknown>(null);
  const [statusCode, setStatusCode] = useState<number | null>(null);

  const addHeader = () => {
    setHeaders([...headers, { key: '', value: '' }]);
  };

  const handleRequest = async () => {
    const headersObj = Object.fromEntries(
      headers.map((header) => [header.key, header.value])
    );
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headersObj,
      },
      body: JSON.stringify({ query, variables: JSON.parse(variables || '{}') }),
    });

    setStatusCode(res.status);
    const jsonResponse = await res.json();
    setResponse(jsonResponse);
  };

  const handleDelHeader = (index: number) => {
    setHeaders(headers.filter((_, itemIndex) => itemIndex != index));
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
          />
        </div>

        <div>
          <h3>Headers:</h3>
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

          <UIButton onClick={addHeader}>Add Header</UIButton>
        </div>
      </section>
      <section>
        <h3>Query</h3>
        <CodeMirror
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
          minHeight="80px"
        />

        <h3>Variables</h3>
        <CodeMirror
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
          minHeight="80px"
        />

        <UIButton onClick={handleRequest}>Send</UIButton>

        <h3>Response:</h3>
        <p>Status: {statusCode}</p>
        {response && <JSONTree data={response} />}
      </section>
    </div>
  );
};

export default GraphiQLPage;
