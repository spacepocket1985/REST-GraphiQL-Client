import Link from 'next/link';
import { CSSProperties } from 'react';

type UIButtonProps = {
  text?: string;
  style?: CSSProperties;
  href?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
};

const UIButton = (props: UIButtonProps) => {
  const {
    text,
    href = '',
    style,
    onClick,
    type = 'button',
    disabled = false,
  } = props;
  return (
    <Link href={href} passHref>
      <button style={style} onClick={onClick} type={type} disabled={disabled}>
        {text}
      </button>
    </Link>
  );
};

export default UIButton;
