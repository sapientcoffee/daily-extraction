import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ThemeToggle from './ThemeToggle';
import * as ThemeProviderModule from './ThemeProvider';

// Mock useTheme
vi.mock('./ThemeProvider', () => ({
  useTheme: vi.fn()
}));

describe('ThemeToggle', () => {
  it('renders correctly in terminal mode', () => {
    vi.spyOn(ThemeProviderModule, 'useTheme').mockReturnValue({
      theme: 'terminal',
      toggleTheme: vi.fn(),
      setTheme: vi.fn()
    });

    render(<ThemeToggle />);
    expect(screen.getByText('Terminal Mode')).toBeInTheDocument();
  });

  it('renders correctly in modern mode', () => {
    vi.spyOn(ThemeProviderModule, 'useTheme').mockReturnValue({
      theme: 'modern',
      toggleTheme: vi.fn(),
      setTheme: vi.fn()
    });

    render(<ThemeToggle />);
    expect(screen.getByText('Modern Mode')).toBeInTheDocument();
  });

  it('calls toggleTheme when clicked', () => {
    const toggleThemeMock = vi.fn();
    vi.spyOn(ThemeProviderModule, 'useTheme').mockReturnValue({
      theme: 'terminal',
      toggleTheme: toggleThemeMock,
      setTheme: vi.fn()
    });

    render(<ThemeToggle />);
    const button = screen.getByRole('button', { name: 'Toggle Theme' });
    fireEvent.click(button);
    expect(toggleThemeMock).toHaveBeenCalledTimes(1);
  });
});
