import { render, screen, act, fireEvent } from '@testing-library/react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import RESTfullPage from '@/app/RESTfull-client/[method]/[urlBase64Encoded]/[bodyBase64Encoded]/page';

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
const decodeEndpoint = '/RESTfull-client/GET/IA==/e30=/';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
  })),
  usePathname: vi.fn(() => '/RESTfull-client/GET/IA==/e30=/'),
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

describe('RESTfullPage', () => {
  const props = {
    params: {
      method: 'GET',
      urlBase64Encoded: btoa('http://example.com'),
      bodyBase64Encoded: btoa('{}'),
    },
  };
  const renderWithAuth = () => {
    return render(
      <AuthProvider>
        <RESTfullPage {...props} />
      </AuthProvider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders spinner when loading', async () => {
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      isLoading: false,
      user: null,
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

    expect(screen.getByText(/restClient/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/method/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/endpointURL/i)).toBeInTheDocument();
  });

  // Mock the global fetch function
  global.fetch = vi.fn(() =>
    Promise.resolve(
      new Response(JSON.stringify({ data: 'mocked data' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    )
  );

  it('should call sendRequest and update state on button click', async () => {
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      user: { name: 'Alex' },
      isLoading: false,
      loading: false,
    });

    await act(async () => {
      renderWithAuth();
    });

    const sendRequestButton = screen.getByText('sendRequest');
    fireEvent.click(sendRequestButton);

    await vi.waitFor(() => {
      expect(fetch).toHaveBeenCalled();

      expect(fetch).toHaveBeenCalledWith(
        'http://example.com',
        expect.any(Object)
      );
      expect(screen.getByText(/mocked data/)).toBeInTheDocument();
    });
  });
});
