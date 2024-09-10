import styles from './About.module.css';

import { useTranslation } from 'react-i18next';

const AppInfo: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <h4 className={styles.title}>{t('titleAboutApp')}</h4>
      <p className={styles.info}>{t('description')}</p>
    </>
  );
};
export default AppInfo;
