import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer>
      <h2>Footer</h2>
      <div className={styles.footerWrapper}>
        <div>[GitHub Link] | Year | </div>
        <div>{new Date().getFullYear()}</div>
        <div>[Course Logo] </div>
      </div>
    </footer>
  );
}
