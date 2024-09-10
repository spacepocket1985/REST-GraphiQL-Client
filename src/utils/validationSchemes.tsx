import * as Yup from 'yup';

const passwordValidation = Yup.string()
  .required('validationPasswordRequired')
  .matches(
    /^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]*$/,
    'validationPasswordValidSetOfCharacters'
  )
  .matches(/[A-Z]/, 'validationPasswordUpperCaseLetter')
  .matches(/[a-z]/, 'validationPasswordLowerCaseLetter')
  .matches(/[0-9]/, 'validationPasswordDigit')
  .matches(/[!@#$%^&*]/, 'validationPasswordSpecialChar')
  .matches(/^\S*$/, 'validationPasswordWhitespace')
  .min(8, 'validationPasswordSize');

const emailValidation = Yup.string()
  .required('validationEmailRequired')
  .email('validationEmailInvalid')
  .matches(
    /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/,
    'validationEmailInvalidOrDomain'
  )
  .matches(
    /^[\w!#$%&'*+\-/=?^_`{|}~]+(?:\.[\w!#$%&'*+\-/=?^_`{|}~]+)*@[\w-]+(?:\.[\w-]+)*(?:\.[a-zA-Z]{2,})?$/,
    'validationEmailInvalidLocalToggle'
  );

const nameValidation = Yup.string()
  .required('validationNameRequired')
  .min(2, 'validationName2Characters');

const signUpValidationSchema = Yup.object({
  name: nameValidation,
  email: emailValidation,
  password: passwordValidation,
  confirmPassword: Yup.string()
    .required('validationConfirmPasswordRequired')
    .oneOf([Yup.ref('password')], 'validationConfirmPasswordDoestMatch'),
});

const signInValidationSchema = Yup.object({
  email: emailValidation,
  password: Yup.string().required('validationPasswordRequired'),
});

export { signUpValidationSchema, signInValidationSchema };
