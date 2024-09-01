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
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

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
      <h2>{t('signUp')}</h2>
      <form onSubmit={handleSubmit(registerUser)}>
        <UIFormInput
          type="text"
          name="name"
          register={register}
          placeholder={t('name')}
          error={errors.name?.message ? t(errors.name.message) : null}
          required
        />
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
        <UIFormInput
          type="password"
          name="confirmPassword"
          register={register}
          placeholder={t('confirmPassword')}
          error={
            errors.confirmPassword?.message
              ? t(errors.confirmPassword.message)
              : null
          }
          required
        />
        <UIButton type="submit" disabled={!isValid} text="Sign up" />
      </form>
      <p>
        {t('haveAccount')}
        <Link href={RoutePaths.SIGNIN}> {t('login')}</Link>
      </p>
    </>
  );
}
