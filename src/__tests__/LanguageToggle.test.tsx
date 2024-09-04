import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom';
import { Providers } from '@/app/providers';
import LanguageToggle from '@/components/languageToggle/LanguageToggle';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
  usePathname: vi.fn(() => '/'),
}));

describe('Tests for LanguageToggle component', () => {
  it('toggles lang when button is clicked', async () => {
    render(
      <Providers>
        <LanguageToggle />
      </Providers>
    );

    const rusButton = screen.getByText('rus');
    expect(rusButton).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(rusButton);
    });

    const engButton = screen.getByText('англ');
    expect(engButton).toBeInTheDocument();
  });
});
