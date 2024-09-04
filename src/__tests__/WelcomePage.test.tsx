import { render, screen, act } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AuthProvider } from '@/context/AuthContext';
import WelcomePage from '@/app/page';

import { useAuth } from '@/context/AuthContext';

vi.mock('@/context/AuthContext', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(typeof actual === 'object' ? actual : {}),
    useAuth: vi.fn(),
  };
});

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
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

describe('WelcomePage', () => {
  const renderWithAuth = () => {
    return render(
      <AuthProvider>
        <WelcomePage />
      </AuthProvider>
    );
  };

  it('should render loading spinner when isLoading is true', async () => {
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      user: null,
      name: null,
      isLoading: true,
    });

    await act(async () => {
      renderWithAuth();
    });
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('should greet user with name when user is logged in', async () => {
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      user: { uid: '123' },
      name: 'John Doe',
      isLoading: false,
    });

    await act(async () => {
      renderWithAuth();
    });
    expect(screen.getByText(/greetingsUser, John Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/titleAvailableUtils/i)).toBeInTheDocument();
    expect(screen.getByText(/restClient/i)).toBeInTheDocument();
    expect(screen.getByText(/graphClient/i)).toBeInTheDocument();
    expect(screen.getByText(/history/i)).toBeInTheDocument();
  });

  it('should show greeting when no user is logged in', async () => {
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      user: null,
      name: null,
      isLoading: false,
    });

    await act(async () => {
      renderWithAuth();
    });
    expect(screen.getByText(/greetings/i)).toBeInTheDocument();
    expect(screen.queryByText(/titleAvailableUtils/i)).not.toBeInTheDocument();
    expect(screen.getByText(/team/i)).toBeInTheDocument();
    expect(screen.getByText(/titleAboutRS/i)).toBeInTheDocument();
  });
});
