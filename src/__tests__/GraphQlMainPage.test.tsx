import { render, screen, act } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AuthProvider } from '@/context/AuthContext';

import { useAuth } from '@/context/AuthContext';

import GraphiQL from '@/app/GRAPHQL/page';

document.createRange = () => {
  const range = new Range();

  range.getBoundingClientRect = vi.fn();

  range.getClientRects = vi.fn(() => {
    return {
      item: () => null,
      length: 0,
      [Symbol.iterator]: function* () {
        yield* [];
      },
    };
  });

  return range;
};

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

describe('GraphQL start page', () => {
  const renderWithAuth = () => {
    return render(
      <AuthProvider>
        <GraphiQL />
      </AuthProvider>
    );
  };

  it('should show spinner before redirect to Welcome page when user is not log in', async () => {
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      user: null,
      isLoading: false,
    });

    await act(async () => {
      renderWithAuth();
    });
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('should render page right', async () => {
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      user: { name: 'Alex' },
      isLoading: false,
      loading: false,
    });

    await act(async () => {
      renderWithAuth();
    });

    expect(screen.getByText(/sDLDocs/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/endpointURL/i)).toBeInTheDocument();
    expect(screen.getByText(/prettify/i)).toBeInTheDocument();
    expect(screen.getByText(/sendRequest/i)).toBeEnabled();
  });
});
