'use client';

import { UILink } from '@/components/ui/UILink';
import { RoutePaths } from '@/constants/routePaths';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './page.module.css';

const RESTmethods = [
  'GET',
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
  'OPTIONS',
  'HEAD',
];

const History: React.FC = () => {
  const { t } = useTranslation();
  const [history, setHistory] = useState<string[] | null>(null);

  useEffect(() => {
    const storedHistory = localStorage.getItem('RestGraphqlHistoryLogs');
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
  }, []);

  const createLinkText = (url: string) => {
    const [endpoint] = url.split('/').slice(-2);
    const decodeEndpoint = Buffer.from(endpoint, 'base64').toString('utf-8');
    const isMethod = RESTmethods.find((method) => url.includes(method));
    const client = isMethod ? `Rest - ${isMethod}` : 'Graphql';
    return { client, decodeEndpoint };
  };

  const renderData = history ? (
    history
      .slice()
      .reverse()
      .map((item: string, index: number) => {
        const { client, decodeEndpoint } = createLinkText(item);
        return (
          <p className={styles.line} key={index}>
            <span
              className={
                client.includes('Graphql') ? styles.graph : styles.rest
              }
            >
              {client}
            </span>
            <Link href={item} className={styles.historyLink}>
              {decodeEndpoint}
            </Link>
          </p>
        );
      })
  ) : (
    <>
      <h4>{t('noHistory')}</h4>
      <div className={styles.linksWrapper}>
        <UILink text={t('restClient')} href={RoutePaths.RESTFULL} />
        <UILink text={t('graphClient')} href={RoutePaths.GRAPHIQL} />
      </div>
    </>
  );

  return (
    <>
      <h2>{t('history')}</h2>
      <div className={styles.historyWrapper}>{renderData}</div>
    </>
  );
};

export default History;
