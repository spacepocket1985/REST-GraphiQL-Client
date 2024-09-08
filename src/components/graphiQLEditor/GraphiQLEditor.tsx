'use client';

import { JsonView, allExpanded, defaultStyles } from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';
import gqlPrettier from 'graphql-prettier';
import React, { useEffect, useState } from 'react';

import { UIButton } from '../ui/UIButton';

import { onError } from '@/utils/firebase';
import { graphBase } from '@/constants/graphiQLData';
import { fetchGraphQLSchema, GraphQLType } from '@/utils/fetchGraphQLSchema';
import GraphQLSchemaViewer from './GraphQLSchemaViewer';
import { useRouter } from 'next/navigation';
import { Spinner } from '../spinner/Spinner';
import styles from './GraphiQLEditor.module.css';
import { RoutePaths } from '@/constants/routePaths';
import { useTranslation } from 'react-i18next';
import CodeEditor from './CodeEditor';

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

  const { t } = useTranslation();
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

  const handleUrl = (
    sendRequest: boolean,
    newHeaders: {
      key: string;
      value: string;
    }[] = headers
  ) => {
    const finalHedars = newHeaders ? newHeaders : headers;
    const headersObj = Object.fromEntries(
      finalHedars
        .filter((header) => header.key.trim() !== '')
        .map((header) => [header.key, header.value])
    );
    let finalUrl = '';
    try {
      const endpointUrlBase64 = btoa(endpoint);
      finalUrl = endpoint ? `${endpointUrlBase64}/` : '';
    } catch (error) {
      setEndpoint('');
      setSdlUrl('');
      if (error instanceof Error) onError(t('errMsgEncodEndpoint'));
      return;
    }

    const bodyBase64 = btoa(
      encodeURIComponent(JSON.stringify({ query, variables }))
    );
    const finalBody = variables || query ? `/${bodyBase64}` : '';

    const newUrl = `${RoutePaths.GRAPHIQL}/${finalUrl}${finalBody}?${new URLSearchParams(headersObj).toString()}`;

    window.history.replaceState(null, '', newUrl);
    if (sendRequest) router.push(newUrl);
  };

  const handleEndpointOnFocus = () => {
    handleUrl(false);
    setSdlUrl(endpoint ? `${endpoint}?sdl` : '');
  };

  const handleDelHeader = async (index: number) => {
    const newHeaders = headers.filter((_, itemIndex) => itemIndex !== index);
    setHeaders(newHeaders);
    handleUrl(false, newHeaders);
  };

  const handlePrettify = () => {
    try {
      const prettifiedQuery = gqlPrettier(query);

      setQuery(prettifiedQuery);
    } catch (error) {
      if (error instanceof Error) onError(t('errMsgPrettier') + error.message);
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
            placeholder={t('endpointURL')}
            className={styles.editorInput}
            onBlur={handleEndpointOnFocus}
          />
          <p className={styles.url}>{t('url')}</p>
        </div>
        <div className={styles.urlLine}>
          <input
            type="text"
            value={sdlUrl}
            onChange={(e) => setSdlUrl(e.target.value)}
            placeholder={t('endpoinSDL')}
            className={styles.editorInput}
          />
          <p className={styles.url}>{t('sdl')}</p>
        </div>
      </section>
      <section>
        <div className={styles.titleLine}>
          <h3
            onClick={() => setIsHeadersVisible(!isHeadersVisible)}
            className={styles.sectionTitle}
          >
            {t('headers')} {!isHeadersVisible ? `${t('show')}` : `${t('hide')}`}
          </h3>
          <UIButton onClick={addHeader}>{t('addHeader')}</UIButton>
        </div>

        {isHeadersVisible && (
          <>
            {headers.map((header, index) => (
              <div key={index} className={styles.headerWrapper}>
                <input
                  type="text"
                  placeholder={t('headerKey')}
                  value={header.key}
                  onChange={(e) => {
                    const newHeaders = [...headers];
                    newHeaders[index].key = e.target.value;
                    setHeaders(newHeaders);
                    handleUrl(false);
                  }}
                />
                <input
                  type="text"
                  placeholder={t('headerValue')}
                  value={header.value}
                  onChange={(e) => {
                    const newHeaders = [...headers];
                    newHeaders[index].value = e.target.value;
                    setHeaders(newHeaders);
                    handleUrl(false);
                  }}
                />
                <UIButton
                  data-testid="btnDelHeader"
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
            {t('query')} {!isQueryVisible ? `${t('show')}` : `${t('hide')}`}
          </h3>
          <UIButton onClick={handlePrettify}>{t('prettify')}</UIButton>
        </div>
        {isQueryVisible && (
          <CodeEditor
            data={query}
            onChange={(newValue) => setQuery(newValue)}
            onBlur={() => {
              handleUrl(false);
            }}
          />
        )}
      </section>
      <section>
        <h3
          onClick={() => setIsVariablesVisible(!isVariablesVisible)}
          className={styles.sectionTitle}
        >
          {t('variables')}{' '}
          {!isVariablesVisible ? `${t('show')}` : `${t('hide')}`}
        </h3>
        {isVariablesVisible && (
          <CodeEditor
            data={variables}
            onChange={(newValue) => setVariables(newValue)}
            onBlur={() => {
              handleUrl(false);
            }}
          />
        )}
      </section>
      <UIButton
        onClick={() => {
          handleUrl(true);
        }}
        disabled={endpoint.length === 0}
      >
        {t('sendRequest')}
      </UIButton>
      <section>
        <div className={styles.titleLine}>
          <h3 className={styles.sectionTitle}>{t('response')}</h3>
          <p className={styles.status}>
            {t('status')} {statusCode}
          </p>
        </div>

        <div className={styles.response}>
          {isLoading && endpoint ? (
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
        <h3 className={styles.sectionTitle}>{t('sDLDocs')}</h3>
        <div className={styles.response}>
          {sdlDocs && <GraphQLSchemaViewer types={sdlDocs} />}
        </div>
      </section>
    </div>
  );
};

export default GraphiQLEditor;
