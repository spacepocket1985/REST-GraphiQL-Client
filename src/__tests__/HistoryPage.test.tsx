import { render, screen, act } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AuthProvider } from '@/context/AuthContext';
import History from '@/app/history/page';

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

describe('HistoryPage', () => {
  const renderWithAuth = () => {
    return render(
      <AuthProvider>
        <History />
      </AuthProvider>
    );
  };

  it('should show history page when user is logged in', async () => {
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      user: { uid: '123' },
      name: 'John Doe',
      isLoading: false,
    });

    await act(async () => {
      renderWithAuth();
    });
    expect(screen.getByText(/noHistory/i)).toBeInTheDocument();
    expect(screen.getByText(/restClient/i)).toBeInTheDocument();
    expect(screen.getByText(/graphClient/i)).toBeInTheDocument();
  });

  it('should render history items when there is history', async () => {
    const mockHistory = [
      'http://example.com/GET/endpoint1',
      'http://example.com/POST/endpoint2',
    ];
    localStorage.setItem('RestGraphqlHistoryLogs', JSON.stringify(mockHistory));

    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      user: { uid: '123' },
      name: 'John Doe',
      isLoading: false,
    });

    await act(async () => {
      renderWithAuth();
    });
    expect(screen.getByText('Rest - GET')).toBeInTheDocument();
    expect(screen.getByText('Rest - POST')).toBeInTheDocument();
  });
});
