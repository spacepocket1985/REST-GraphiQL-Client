import { useState } from 'react';
import Image from 'next/image';
import { FieldValues, Path, UseFormRegister } from 'react-hook-form';
import styles from './UIFormInput.module.css';

type UiFormInputProps<T extends FieldValues> = {
  type?: React.HTMLInputTypeAttribute;
  name: Path<T>;
  register: UseFormRegister<T>;
  required: boolean;
  placeholder?: string;
  error: string | null;
};

export const UIFormInput = <T extends FieldValues>({
  type,
  name,
  register,
  required,
  placeholder,
  error = '',
}: UiFormInputProps<T>): JSX.Element => {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <label htmlFor={name} className={styles.inputLabel}>
      <input
        id={name}
        type={showPassword ? 'text' : type}
        autoComplete={type === 'password' ? 'on' : ''}
        className={styles.uiInput}
        {...register(name, { required })}
        placeholder={placeholder}
      />
      {type === 'password' && (
        <span
          aria-hidden="true"
          className={styles.pasImgWrapper}
          onClick={handleTogglePassword}
        >
          {showPassword ? (
            <Image
              src="/iconView.png"
              alt="View Password"
              width={16}
              height={16}
            />
          ) : (
            <Image
              src="/iconNoView.png"
              alt="Hide Password"
              width={16}
              height={16}
            />
          )}
        </span>
      )}
      <div className={styles.invalidFeedback}>{error}</div>
    </label>
  );
};
