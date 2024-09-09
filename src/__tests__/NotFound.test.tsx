import { render, screen, act } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AuthProvider } from '@/context/AuthContext';

import { useAuth } from '@/context/AuthContext';

import NotFound from '@/app/not-found';

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

describe('NotFound', () => {
  const renderWithAuth = () => {
    return render(
      <AuthProvider>
        <NotFound />
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
    expect(screen.getByText(/404/i)).toBeInTheDocument();
    expect(screen.getByText(/notFound/i)).toBeInTheDocument();
  });
});
