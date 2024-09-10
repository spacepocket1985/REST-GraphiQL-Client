import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './LanguageToggle.module.css';
import { UIButton } from '../ui/UIButton';

const LanguageToggle: React.FC = () => {
  const { i18n, t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const handleEngClick = (): void => {
    setIsVisible(false);
    changeLanguage('en');
  };

  const handleRusClick = (): void => {
    setIsVisible(true);
    changeLanguage('ru');
  };

  return (
    <div className={styles.languageToggle}>
      {isVisible ? (
        <UIButton
          onClick={handleEngClick}
          className={styles.languageToggleButton}
          text={t('eng')}
        />
      ) : (
        <UIButton
          onClick={handleRusClick}
          className={styles.languageToggleButton}
          text={t('rus')}
        />
      )}
    </div>
  );
};

export default LanguageToggle;
