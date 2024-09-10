import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import GraphiQLEditor, {
  Props,
} from '@/components/graphiQLEditor/GraphiQLEditor';

const mockUseRouter = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => mockUseRouter(),
}));

vi.mock('@/utils/fetchGraphQLSchema', () => ({
  fetchGraphQLSchema: vi.fn(),
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

const setup = (props: Props) => {
  render(<GraphiQLEditor {...props} />);
};

describe('GraphiQLEditor', () => {
  const defaultProps = {
    paramEndpoint: 'http://example.com/graphql',
    paramSdl: 'http://example.com/graphql?sdl',
    paramVariables: '',
    paramHeaders: [],
    paramQuery: '',
    response: null,
    statusCode: null,
    isLoading: false,
  };

  it('renders without crashing', async () => {
    await act(async () => {
      setup(defaultProps);
    });

    expect(screen.getByPlaceholderText(/endpointURL/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/endpoinSDL/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /sendRequest/i })
    ).toBeInTheDocument();
  });

  it('allows user to type in endpoint input', async () => {
    await act(async () => {
      setup(defaultProps);
    });

    const endpointInput = screen.getByPlaceholderText(
      /endpointURL/i
    ) as HTMLInputElement;

    await act(async () => {
      fireEvent.change(endpointInput, {
        target: { value: 'http://new-endpoint.com/graphql' },
      });
    });

    expect(endpointInput.value).toBe('http://new-endpoint.com/graphql');
  });

  it('adds a new header when the button is clicked', async () => {
    await act(async () => {
      setup(defaultProps);
    });

    expect(screen.queryByPlaceholderText(/headerKey/i)).not.toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByText(/addHeader/i));
    });

    await act(async () => {
      fireEvent.click(screen.getByText(/addHeader/i));
    });

    expect(screen.getAllByPlaceholderText(/headerKey/i).length).toBe(2);

    const btnDelHeader = screen.getAllByTestId('btnDelHeader');

    expect(btnDelHeader[0]).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(btnDelHeader[0]);
    });
    expect(screen.getAllByPlaceholderText(/headerKey/i).length).toBe(1);
  });

  it('displays a spinner when loading', async () => {
    await act(async () => {
      setup({ ...defaultProps, isLoading: true });
    });

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('renders response when provided', async () => {
    const mockResponse = { data: { someField: 'value' } };

    await act(async () => {
      setup({ ...defaultProps, response: mockResponse, statusCode: 200 });
    });

    expect(screen.getByText(/status 200/i)).toBeInTheDocument();
    expect(screen.getByText(/value/i)).toBeInTheDocument();
  });
});
