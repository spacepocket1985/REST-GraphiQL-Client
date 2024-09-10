import Link from 'next/link';
import styles from './About.module.css';

import { useTranslation } from 'react-i18next';

const RsSchool: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <Link href="https://rs.school/">
        <h4 className={styles.title}>{t('titleAboutRS')}</h4>
      </Link>
      <p className={styles.info}>{t('descriptionRS')}</p>
    </>
  );
};
export default RsSchool;
