'use client';

import { JsonView, allExpanded, defaultStyles } from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';
import gqlPrettier from 'graphql-prettier';
import CodeMirror, { EditorView } from '@uiw/react-codemirror';
import React, { useEffect, useState } from 'react';

import { UIButton } from '../ui/UIButton';

import { onError } from '@/utils/firebase';
import { graphBase } from '@/constants/graphiQLData';
import { fetchGraphQLSchema, GraphQLType } from '@/utils/fetchGraphQLSchema';
import GraphQLSchemaViewer from './GraphQLSchemaViewer';
import { useRouter } from 'next/navigation';
import { Spinner } from '../spinner/Spinner';
import styles from './GraphiQLEditor.module.css';

export interface Props {
  paramEndpoint?: string;
  paramSdl?: string;
  paramVariables?: string;
  paramHeaders?: { key: string; value: string }[];
  paramQuery?: string;
  response?: Record<string, unknown> | null;
  statusCode?: number | null;
  isLoading?: boolean;
}

const GraphiQLEditor: React.FC<Props> = ({
  paramEndpoint,
  paramSdl,
  paramVariables,
  paramHeaders,
  paramQuery,
  statusCode,
  response,
  isLoading,
}) => {
  const [endpoint, setEndpoint] = useState<string>('');
  const [sdlUrl, setSdlUrl] = useState<string>('');
  const [query, setQuery] = useState<string>('');

  const [variables, setVariables] = useState<string>('');
  const [headers, setHeaders] = useState<{ key: string; value: string }[]>(
    graphBase.headers
  );

  const [sdlDocs, setSdlDocs] = useState<GraphQLType[] | null>(null);

  const [isQueryVisible, setIsQueryVisible] = useState(true);
  const [isHeadersVisible, setIsHeadersVisible] = useState(true);
  const [isVariablesVisible, setIsVariablesVisible] = useState(true);

  const router = useRouter();

  useEffect(() => {
    if (paramEndpoint) {
      setEndpoint(paramEndpoint);
      setSdlUrl(`${paramEndpoint}?sdl`);
    }
    if (paramSdl) setSdlUrl(paramSdl);
    if (paramQuery) setQuery(paramQuery);
    if (paramVariables) setVariables(paramVariables);

    if (paramHeaders) {
      const headerArray = paramHeaders.map(({ key, value }) => ({
        key,
        value,
      }));
      setHeaders(headerArray);
    }
  }, [paramEndpoint, paramHeaders, paramQuery, paramVariables]);

  const addHeader = () => {
    setHeaders([...headers, { key: '', value: '' }]);
  };

  useEffect(() => {
    const fetchSchema = async () => {
      if (response && statusCode === 200) {
        try {
          const schema = await fetchGraphQLSchema(sdlUrl);
          setSdlDocs(schema);
        } catch (error) {
          console.error('Error:', error);
          setSdlDocs(null);
        }
      }
    };

    fetchSchema();
  }, [response, sdlUrl]);

  const handleUrl = () => {
    const headersObj = Object.fromEntries(
      headers
        .filter((header) => header.key.trim() !== '')
        .map((header) => [header.key, header.value])
    );
    const endpointUrlBase64 = btoa(endpoint);
    const bodyBase64 = btoa(
      encodeURIComponent(JSON.stringify({ query, variables }))
    );
    const newUrl = `/GraphiQL-client/${endpointUrlBase64}/${bodyBase64}?${new URLSearchParams(headersObj).toString()}`;
    router.push(newUrl);
  };

  const handleDelHeader = (index: number) => {
    setHeaders(headers.filter((_, itemIndex) => itemIndex !== index));
  };

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
            value={endpoint.trim()}
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
      <UIButton onClick={handleUrl} disabled={endpoint.length === 0}>
        Send request
      </UIButton>
      <section>
        <div className={styles.titleLine}>
          <h3 className={styles.sectionTitle}>Response:</h3>
          <p className={styles.status}>Status: {statusCode}</p>
        </div>

        <div className={styles.response}>
          {isLoading ? (
            <Spinner />
          ) : response ? (
            <JsonView
              data={response}
              shouldExpandNode={allExpanded}
              style={defaultStyles}
            />
          ) : null}
        </div>
      </section>
      <section>
        <h3 className={styles.sectionTitle}>SDL Docs:</h3>
        <div className={styles.response}>
          {sdlDocs && <GraphQLSchemaViewer types={sdlDocs} />}
        </div>
      </section>
    </div>
  );
};

export default GraphiQLEditor;
