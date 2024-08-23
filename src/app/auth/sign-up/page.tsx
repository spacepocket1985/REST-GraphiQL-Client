'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import { UIFormInput } from '@/components/ui/UIInput';
import { signUpValidationSchema } from '@/utils/validationSchemes';
import { auth, registerWithEmailAndPassword, onError } from '@/utils/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect, useState } from 'react';
import { RoutePaths } from '@/constants/routePaths';
import { Spinner } from '@/components/spinner/Spinner';

type SignUpFormType = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SignUpFormType>({
    resolver: yupResolver(signUpValidationSchema),
    mode: 'onChange',
  });

  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (user) router.push(RoutePaths.WELCOME);
  }, [user, loading]);

  const registerUser: SubmitHandler<SignUpFormType> = async ({
    name,
    email,
    password,
  }) => {
    setIsLoading(true);
    try {
      await registerWithEmailAndPassword(name, email, password);
      router.push(RoutePaths.SIGNIN);
    } catch (error) {
      if (error instanceof Error) onError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h2>Sign Up</h2>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
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
            <button type="submit" disabled={!isValid}>
              Sign up
            </button>
          </form>
          <p>
            Already have an account?{' '}
            <Link href={RoutePaths.SIGNIN}>Sign in</Link>
          </p>
        </>
      )}
    </>
  );
}
