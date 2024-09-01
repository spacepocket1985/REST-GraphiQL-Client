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
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

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
      <h2>{t('signIn')}</h2>
      <form onSubmit={handleSubmit(logInUser)}>
        <UIFormInput
          type="text"
          name="email"
          register={register}
          placeholder={t('eMailAddress')}
          error={errors.email?.message ? t(errors.email.message) : null}
          required
        />
        <UIFormInput
          type="password"
          name="password"
          register={register}
          placeholder={t('password')}
          error={errors.password?.message ? t(errors.password.message) : null}
          required
        />
        <UIButton type="submit" disabled={!isValid} text={t('signIn')} />
      </form>
      <p>
        {t('dontHaveAccount')}{' '}
        <Link href={RoutePaths.SIGNUP}>{t('register')}</Link>
      </p>
    </div>
  );
}
