'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { signInValidationSchema } from '@/utils/validationSchemes';
import { UIFormInput } from '@/components/ui/UIInput';

export type SignInFormType = {
  email: string;
  password: string;
};

export default function SignUpPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SignInFormType>({
    resolver: yupResolver(signInValidationSchema),
    mode: 'onChange',
  });

  const logInUser: SubmitHandler<SignInFormType> = ({
    email,
    password,
  }): void => {
    console.log(email, password);
  };
  return (
    <div>
      <h2>Sign In</h2>

      <form onSubmit={handleSubmit(logInUser)}>
        <UIFormInput
          type="text"
          name="email"
          register={register}
          placeholder="email"
          error={errors.email?.message ? errors.email.message : null}
          required
        />
        <UIFormInput
          type="password"
          name="password"
          register={register}
          placeholder="password"
          error={errors.password?.message ? errors.password.message : null}
          required
        />
        <button type="submit" disabled={!isValid}>
          Sign in
        </button>
      </form>
    </div>
  );
}
