import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TipOfTheDay from './TipOfTheDay';

// Mock fetch
global.fetch = vi.fn();

describe('TipOfTheDay', () => {
  it('renders loading state initially', () => {
    (global.fetch as any).mockResolvedValueOnce({
      json: () => Promise.resolve({ title: 'Test Tip', tip: 'This is a test tip', author: 'Author' })
    });
    render(<TipOfTheDay />);
    expect(screen.getByText('Connecting to mindset-service...')).toBeInTheDocument();
  });

  it('renders tip after fetching', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      json: () => Promise.resolve({ title: 'Test Tip', tip: 'This is a test tip', author: 'Author' })
    });
    render(<TipOfTheDay />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Tip')).toBeInTheDocument();
      expect(screen.getByText(/"This is a test tip"/)).toBeInTheDocument();
      expect(screen.getByText('-- Author')).toBeInTheDocument();
    });
  });
});
