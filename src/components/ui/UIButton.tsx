import classNames from 'classnames';
import styles from './UI.module.css';
import { ButtonHTMLAttributes, FC } from 'react';

interface UIButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
}

export const UIButton: FC<UIButtonProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <button className={classNames(styles.uIlinkorButton, className)} {...props}>
      {props.text}
      {children}
    </button>
  );
};
