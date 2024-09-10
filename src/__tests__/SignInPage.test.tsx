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
import SignInPage from '@/app/auth/sign-in/page';
import * as firebase from '@/utils/firebase';

const spy = vi.spyOn(firebase, 'logInWithEmailAndPassword');
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

describe('SignInPage', () => {
  const renderWithAuth = () => {
    return render(
      <AuthProvider>
        <SignInPage />
      </AuthProvider>
    );
  };

  it('should render sign in form', async () => {
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      user: null,
      isLoading: false,
    });

    await act(async () => {
      renderWithAuth();
    });
    expect(screen.getByText('register')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('eMailAddress')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('password')).toBeInTheDocument();
    expect(screen.getByText('dontHaveAccount')).toBeInTheDocument();
  });

  it('should enable submit button when form is valid', async () => {
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      user: null,
      isLoading: false,
    });

    await act(async () => {
      renderWithAuth();
    });

    await waitFor(() => {
      act(() => {
        fireEvent.change(screen.getByPlaceholderText('eMailAddress'), {
          target: { value: 'test@example.com' },
        });
        fireEvent.change(screen.getByPlaceholderText('password'), {
          target: { value: 'password123' },
        });
      });
    });

    act(() => {
      fireEvent.click(screen.getByRole('button'));
    });

    await waitFor(() => {
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
