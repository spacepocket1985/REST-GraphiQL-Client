import Image from 'next/image';
import styles from './About.module.css';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

const data = [
  {
    name: 'developer001',
    image: 'https://avatars.githubusercontent.com/u/107361757?v=4',
    link: 'https://github.com/spacepocket1985',
  },
  {
    name: 'developer002',
    image: 'https://avatars.githubusercontent.com/u/36541816?v=4',
    link: 'https://github.com/borisdmitriy',
  },
  {
    name: 'developer003',
    image: 'https://avatars.githubusercontent.com/u/122939831?v=4',
    link: 'https://github.com/kseniyaand',
  },
];

const Team: React.FC = () => {
  const { t } = useTranslation();
  const renderData = data.map((item, index) => {
    const { name, image, link } = item;
    return (
      <div className={styles.card} key={index}>
        <h4 className={styles.name}>{t(name)}</h4>
        <Link href={link}>
          <Image
            src={image}
            width={160}
            height={160}
            className={styles.avatar}
            alt="Picture of the author"
          />
        </Link>
        <p className={styles.info}>{t('developer')}</p>
      </div>
    );
  });
  return (
    <>
      <h4 className={styles.title}>{t('titleAboutTeam')}</h4>
      <div className={styles.teamWrapper}>{renderData}</div>
    </>
  );
};
export default Team;
