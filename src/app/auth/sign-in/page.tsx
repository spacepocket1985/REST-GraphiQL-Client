'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import Link from 'next/link';
import { yupResolver } from '@hookform/resolvers/yup';
import { signInValidationSchema } from '@/utils/validationSchemes';
import { UIFormInput } from '@/components/ui/UIInput';
import { logInWithEmailAndPassword, onError } from '@/utils/firebase';
import { RoutePaths } from '@/constants/routePaths';

import { UIButton } from '@/components/ui/UIButton';
import { useAuth } from '@/context/AuthContext';
import { Spinner } from '@/components/spinner/Spinner';

export type SignInFormType = {
  email: string;
  password: string;
};

export default function SignInPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SignInFormType>({
    resolver: yupResolver(signInValidationSchema),
    mode: 'onChange',
  });

  const { isLoading, user } = useAuth();

  const logInUser: SubmitHandler<SignInFormType> = async ({
    email,
    password,
  }) => {
    try {
      await logInWithEmailAndPassword(email, password);
    } catch (error) {
      if (error instanceof Error) onError(error);
    }
  };
  if (isLoading || user) return <Spinner />;
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
        <UIButton type="submit" disabled={!isValid} text="Sign in" />
      </form>
      <p>
        Dont have an account? <Link href={RoutePaths.SIGNUP}>Register</Link>
      </p>
    </div>
  );
}
