import { render, screen, act } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AuthProvider } from '@/context/AuthContext';

import Footer from '@/components/footer/Footer';

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

describe('Footer', () => {
  const renderFooter = () => {
    return render(
      <AuthProvider>
        <Footer />
      </AuthProvider>
    );
  };

  it('should render  correct footer', async () => {
    await act(async () => {
      renderFooter();
    });
    expect(screen.getByText(/Aliaksandr/i)).toBeInTheDocument();
    expect(screen.getByText(/Dmitriy/i)).toBeInTheDocument();
    expect(screen.getByText(/Kseniya/i)).toBeInTheDocument();
    expect(screen.getByText(/2024/i)).toBeInTheDocument();
  });
});
