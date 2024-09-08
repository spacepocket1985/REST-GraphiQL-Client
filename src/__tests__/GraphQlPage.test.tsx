import { render, screen, act, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AuthProvider } from '@/context/AuthContext';

import { useAuth } from '@/context/AuthContext';
import GraphQLPage from '@/app/GRAPHQL/[...params]/page';
import { decodeEndpoint } from '@/constants/graphiQLData';

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

const mockSearchParams = new URLSearchParams({
  param1: 'header value1',
  param2: 'header value2',
});

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
  usePathname: vi.fn(() => '/GRAPHQL'),
  useSearchParams: vi.fn(() => mockSearchParams),
}));

Object.defineProperty(window, 'location', {
  value: {
    pathname: decodeEndpoint,
  },
  writable: true,
});

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

describe('GraphQL page with query', () => {
  const renderWithAuth = () => {
    return render(
      <AuthProvider>
        <GraphQLPage />
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
    const inputHeaders = screen.getAllByPlaceholderText(
      /headerKey/i
    ) as HTMLInputElement[];
    const inputHeadersValues = screen.getAllByPlaceholderText(
      /headerValue/i
    ) as HTMLInputElement[];
    const inputEndpoint = screen.getByPlaceholderText(
      /url/i
    ) as HTMLInputElement;
    const inputSDL = screen.getByPlaceholderText(/sdl/i) as HTMLInputElement;

    expect(screen.getByText(/sDLDocs/i)).toBeInTheDocument();
    expect(screen.getByText(/FilterCharacter/i)).toBeInTheDocument();
    expect(screen.getByText(/"name": "Jerry"/i)).toBeInTheDocument();
    expect(inputEndpoint.value).toBe('https://rickandmortyapi.com/graphql');
    expect(inputSDL.value).toBe('https://rickandmortyapi.com/graphql?sdl');
    expect(inputHeaders[0].value).toBe('param1');
    expect(inputHeaders[1].value).toBe('param2');
    expect(inputHeadersValues[0].value).toBe('header value1');
  });

  it('test url', async () => {
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      user: { name: 'Alex' },
      isLoading: false,
      loading: false,
    });

    await act(async () => {
      renderWithAuth();
    });

    const inputEndpoint = screen.getByPlaceholderText(
      /url/i
    ) as HTMLInputElement;

    await act(async () => {
      fireEvent.change(inputEndpoint, {
        target: { value: 'https://someApi/graphql' },
      });
    });

    expect(inputEndpoint.value).toBe('https://someApi/graphql');
  });
});
