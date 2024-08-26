'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import { UIFormInput } from '@/components/ui/UIInput';
import { signUpValidationSchema } from '@/utils/validationSchemes';
import { registerWithEmailAndPassword, onError } from '@/utils/firebase';

import { RoutePaths } from '@/constants/routePaths';
import { Spinner } from '@/components/spinner/Spinner';
import Link from 'next/link';
import { UIButton } from '@/components/ui/UIButton';
import { useAuth } from '@/context/AuthContext';

type SignUpFormType = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function SignUpPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SignUpFormType>({
    resolver: yupResolver(signUpValidationSchema),
    mode: 'onChange',
  });

  const { isLoading, user } = useAuth();

  const registerUser: SubmitHandler<SignUpFormType> = async ({
    name,
    email,
    password,
  }) => {
    try {
      await registerWithEmailAndPassword(name, email, password);
    } catch (error) {
      if (error instanceof Error) onError(error);
    }
  };
  if (isLoading || user) return <Spinner />;
  return (
    <>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit(registerUser)}>
        <UIFormInput
          type="text"
          name="name"
          register={register}
          placeholder="name"
          error={errors.name?.message ? errors.name.message : null}
          required
        />
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
        <UIFormInput
          type="password"
          name="confirmPassword"
          register={register}
          placeholder="confirm password"
          error={
            errors.confirmPassword?.message
              ? errors.confirmPassword.message
              : null
          }
          required
        />
        <UIButton type="submit" disabled={!isValid} text="Sign up" />
      </form>
      <p>
        Already have an account?
        <Link href={RoutePaths.SIGNIN}> Sign in</Link>
      </p>
    </>
  );
}
