import {
  render,
  screen,
  act,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AuthProvider } from '@/context/AuthContext';

import { useAuth } from '@/context/AuthContext';

import * as firebase from '@/utils/firebase';
import SignUpPage from '@/app/auth/sign-up/page';

vi.mock('@/context/AuthContext', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(typeof actual === 'object' ? actual : {}),
    useAuth: vi.fn(),
  };
});
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: mockPush,
  })),
  usePathname: vi.fn(() => '/'),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: unknown) => key,
  }),
  initReactI18next: {
    use: () => {},
    init: () => {},
  },
}));

vi.mock('@/utils/firebase', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(typeof actual === 'object' ? actual : {}),
    logInWithEmailAndPassword: vi.fn(),
    onError: vi.fn(),
  };
});

describe('SignUpPage', () => {
  const renderWithAuth = () => {
    return render(
      <AuthProvider>
        <SignUpPage />
      </AuthProvider>
    );
  };

  it('renders sign up page', async () => {
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      user: null,
      isLoading: false,
    });

    await act(async () => {
      renderWithAuth();
    });
    expect(screen.getByText(/signUp/i)).toBeInTheDocument();
    expect(screen.getByText(/login/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('eMailAddress')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('name')).toBeInTheDocument();
  });

  it('displays error messages if input fields are invalid', async () => {
    await act(async () => {
      renderWithAuth();
    });

    const nameInput = screen.getByPlaceholderText(/name/i) as HTMLInputElement;

    const emailInput = screen.getByPlaceholderText(
      /eMailAddress/i
    ) as HTMLInputElement;

    const passwordInput = screen.getByPlaceholderText(
      'password'
    ) as HTMLInputElement;

    const confirmPasswordInput = screen.getByPlaceholderText(
      'confirmPassword'
    ) as HTMLInputElement;

    fireEvent.change(nameInput, { target: { value: 'A' } });
    fireEvent.change(emailInput, {
      target: { value: 'invalidMailexample.com' },
    });
    fireEvent.change(passwordInput, {
      target: { value: 'BadPassword' },
    });
    fireEvent.change(confirmPasswordInput, {
      target: { value: 'BadPassword1' },
    });

    await waitFor(() => {
      expect(
        screen.getByText(/validationName2Characters/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/validationEmailInvalid/i)).toBeInTheDocument();
      expect(screen.getByText(/validationPasswordDigit/i)).toBeInTheDocument();
      expect(
        screen.getByText(/validationConfirmPasswordDoestMatch/i)
      ).toBeInTheDocument();
    });
  });

  it('should call registerWithEmailAndPassword when form is submitted', async () => {
    const spy = vi.spyOn(firebase, 'registerWithEmailAndPassword');
    await act(async () => {
      renderWithAuth();
    });
    const nameInput = screen.getByPlaceholderText('name') as HTMLInputElement;

    const emailInput = screen.getByPlaceholderText(
      /eMailAddress/i
    ) as HTMLInputElement;

    const passwordInput = screen.getByPlaceholderText(
      'password'
    ) as HTMLInputElement;

    const confirmPasswordInput = screen.getByPlaceholderText(
      'confirmPassword'
    ) as HTMLInputElement;

    await waitFor(() => {
      fireEvent.change(nameInput, { target: { value: 'User' } });
      fireEvent.change(emailInput, { target: { value: 'testMail@test.com' } });
      fireEvent.change(confirmPasswordInput, {
        target: { value: 'Qwerty1234%' },
      });
      fireEvent.change(passwordInput, { target: { value: 'Qwerty1234%' } });
    });

    act(() => {
      fireEvent.click(screen.getByRole('button'));
    });
    await waitFor(() => {
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(
        'User',
        'testMail@test.com',
        'Qwerty1234%'
      );
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
