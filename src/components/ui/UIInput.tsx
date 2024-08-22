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
  return (
    <label htmlFor={name}>
      <input
        id={name}
        type={type}
        autoComplete={type === 'password' ? 'on' : ''}
        className={styles.uiInput}
        {...register(name, { required })}
        placeholder={placeholder}
      />

      <div className={styles.invalidFeedback}>{error}</div>
    </label>
  );
};
