import CodeEditor from '@/components/graphiQLEditor/CodeEditor';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

describe('GraphQLCodeEditor', () => {
  const mockOnChange = vi.fn();

  it('renders with default settings', () => {
    render(
      <CodeEditor
        data="Sample code"
        onChange={mockOnChange}
        useDefaultSettings={true}
      />
    );

    const codeMirrorElement = screen.getByText(/Sample code/i);
    expect(codeMirrorElement).toBeInTheDocument();
  });

  it('renders with custom settings', () => {
    render(
      <CodeEditor
        data="Sample code"
        onChange={mockOnChange}
        useDefaultSettings={false}
      />
    );

    const codeMirrorElement = screen.getByText(/Sample code/i);
    expect(codeMirrorElement).toBeInTheDocument();
  });
});
