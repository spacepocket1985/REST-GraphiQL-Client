import Image from 'next/image';
import styles from './Footer.module.css';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer>
      <div className={styles.footerWrapper}>
        <div className={styles.footerLine}>
          <Link
            href={'https://github.com/spacepocket1985'}
            className={styles.footerLink}
          >
            <div className={styles.footerLine}>
              <Image
                className={styles.footerImg}
                src="/gitHub.png"
                width={50}
                height={50}
                priority={true}
                alt="gitHub Aliaksandr"
              />
              <span className={styles.footerText}>Aliaksandr</span>
            </div>
          </Link>
        </div>
        <div className={styles.footerLine}>
          <Link
            href={'https://github.com/borisdmitriy'}
            className={styles.footerLink}
          >
            <div className={styles.footerLine}>
              <Image
                className={styles.footerImg}
                src="/gitHub.png"
                width={50}
                height={50}
                priority={true}
                alt="gitHub Dmitriy"
              />
              <span className={styles.footerText}>Dmitriy</span>
            </div>
          </Link>
        </div>
        <div className={styles.footerLine}>
          <Link
            href={'https://github.com/kseniyaand'}
            className={styles.footerLink}
          >
            <div className={styles.footerLine}>
              <Image
                className={styles.footerImg}
                src="/gitHub.png"
                width={50}
                height={50}
                priority={true}
                alt="gitHub Kseniya"
              />
              <span className={styles.footerText}>Kseniya</span>
            </div>
          </Link>
        </div>
        <div className={styles.footerLine}>
          <div className={styles.footerLine}>
            <Link href={'https://rs.school/courses/reactjs'}>
              <Image
                className={styles.footerImg}
                src="/rss-logo.png"
                width={50}
                height={50}
                alt="rs school"
                priority={true}
              />
            </Link>
            <div className={styles.footerText}>{new Date().getFullYear()}</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
