'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { yupResolver } from '@hookform/resolvers/yup';
import { signInValidationSchema } from '@/utils/validationSchemes';
import { UIFormInput } from '@/components/ui/UIInput';
import { auth, logInWithEmailAndPassword, onError } from '@/utils/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { RoutePaths } from '@/constants/routePaths';
import { Spinner } from '@/components/spinner/Spinner';

export type SignInFormType = {
  email: string;
  password: string;
};

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SignInFormType>({
    resolver: yupResolver(signInValidationSchema),
    mode: 'onChange',
  });

  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (loading) {
      return;
    }
    if (!user) setIsLoading(false);
    if (user) router.push(RoutePaths.WELCOME);
  }, [user, loading]);

  const logInUser: SubmitHandler<SignInFormType> = async ({
    email,
    password,
  }) => {
    setIsLoading(true);
    try {
      await logInWithEmailAndPassword(email, password);
    } catch (error) {
      if (error instanceof Error) onError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {user || isLoading ? (
        <Spinner />
      ) : (
        <>
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
          <p>
            Dont have an account? <Link href={RoutePaths.SIGNUP}>Register</Link>
          </p>
        </>
      )}
    </div>
  );
}
