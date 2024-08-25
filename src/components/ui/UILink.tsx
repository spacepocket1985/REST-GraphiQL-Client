import Link from 'next/link';
import { AnchorHTMLAttributes, FC } from 'react';
import classNames from 'classnames';

import styles from './UI.module.css';

interface UILinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  text?: string;
}

export const UILink: FC<UILinkProps> = ({ children, className, ...props }) => {
  return (
    <Link
      {...props}
      href={props.href}
      className={classNames(styles.uIlinkorButton, className)}
    >
      {props.text}
      {children}
    </Link>
  );
};
