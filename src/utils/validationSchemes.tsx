import * as Yup from 'yup';

const passwordValidation = Yup.string()
  .required('Password is required')
  .matches(
    /^[a-zA-Z0-9!@#$%^&*\p{L}\p{N}\p{S}\p{P}]*$/u,
    'Invalid set of characters'
  )
  .matches(/[A-Z]/, 'Password must have at least one uppercase letter')
  .matches(/[a-z]/, 'Password must have at least one lowercase letter')
  .matches(/[0-9]/, 'Password must have at least one digit')
  .matches(/[!@#$%^&*]/, 'Pas must contain at least one special character')
  .matches(/^\S*$/, 'Password with whitespace')
  .min(8, 'Password length must be at least 8 characters');

const emailValidation = Yup.string()
  .required('Email is required')
  .email('Email is invalid')
  .matches(
    /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/,
    'Email invalid or domain'
  )
  .matches(
    /^[\w!#$%&'*+\-/=?^_`{|}~]+(?:\.[\w!#$%&'*+\-/=?^_`{|}~]+)*@[\w-]+(?:\.[\w-]+)*(?:\.[a-zA-Z]{2,})?$/,
    'Email invalid local toggle'
  );

const nameValidation = Yup.string()
  .required('Name is required')
  .min(2, 'Naame length must be at least 2 characters');

const signUpValidationSchema = Yup.object({
  name: nameValidation,
  email: emailValidation,
  password: passwordValidation,
  confirmPassword: Yup.string()
    .required('Confirm password is required')
    .oneOf([Yup.ref('password')], 'Confirm password does not match'),
});

const signInValidationSchema = Yup.object({
  email: emailValidation,
  password: Yup.string().required(),
});

export { signUpValidationSchema, signInValidationSchema };
