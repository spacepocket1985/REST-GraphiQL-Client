'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import { UIFormInput } from '@/components/ui/UIInput';
import { signUpValidationSchema } from '@/utils/validationSchemes';
import { auth, registerWithEmailAndPassword } from '@/utils/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect } from 'react';
import { RoutePaths } from '@/constants/routePaths';

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

  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (user) router.push('/auth/sign-in');
  }, [user, loading]);

  const onError = () => {
    // toast.error(state.strings.signUpPageFirebaseError, {
    //   position: toast.POSITION.TOP_LEFT,
    // });
    console.log('error register');
  };

  const registerUser: SubmitHandler<SignUpFormType> = ({
    name,
    email,
    password,
  }) => {
    registerWithEmailAndPassword(name, email, password).catch(onError);
  };

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
        <button type="submit" disabled={!isValid}>
          Sign up
        </button>
      </form>
      <p>
        Already have an account? <Link href={RoutePaths.SIGNIN}>Sign in</Link>
      </p>
    </>
  );
}
