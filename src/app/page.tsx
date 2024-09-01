'use client';

import { UILink } from '@/components/ui/UILink';
import { useTranslation } from 'react-i18next';

import { useAuth } from '@/context/AuthContext';
import { Spinner } from '@/components/spinner/Spinner';
import { RoutePaths } from '@/constants/routePaths';

import styles from './page.module.css';
import Team from '@/components/about/Team';
import AppInfo from '@/components/about/AppInfo';
import RsSchool from '@/components/about/RsSchool';

export default function WelcomePage() {
  const { user, name, isLoading } = useAuth();
  const { t } = useTranslation();
  if (isLoading) return <Spinner />;

  return (
    <>
      <div className={styles.welcomeWrapper}>
        <h2>
          {name ? `${t('greetingsUser')}, ${name}!` : `${t('greetings')}`}
        </h2>
        {user ? (
          <>
            <div className="welcomeSection">
              <h3 className={styles.wrapperSubTitle}>
                {t('titleAvailableUtils')}
              </h3>
              <div className={styles.welcomeTools}>
                <UILink text={t('restClient')} href={RoutePaths.RESTFULL} />
                <UILink text={t('graphClient')} href={RoutePaths.GRAPHIQL} />
                <UILink text={t('history')} href="" />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className={styles.welcomeSection}>
              <AppInfo />
              <Team />
              <RsSchool />
            </div>
          </>
        )}
      </div>
    </>
  );
}
