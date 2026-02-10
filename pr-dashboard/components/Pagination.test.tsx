/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Pagination from './Pagination';

describe('Pagination Component', () => {
  // Default props for common test cases
  const defaultProps = {
    page: 1,
    setPage: jest.fn(),
    hasMore: true,
    loading: false,
    count: 20,
    isCached: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with initial data', () => {
    render(<Pagination {...defaultProps} />);
    
    // Check if the current PR count is displayed
    expect(screen.getByText('20')).toBeInTheDocument();
    // Check if the current page number is displayed
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('shows the Cached badge only when loading is false and isCached is true', () => {
    const { rerender } = render(<Pagination {...defaultProps} isCached={true} />);
    
    // Should be visible when isCached is true and not loading
    expect(screen.getByText(/cached/i)).toBeInTheDocument();

    // Should NOT be visible if loading is true even if isCached is true
    rerender(<Pagination {...defaultProps} isCached={true} loading={true} />);
    expect(screen.queryByText(/cached/i)).not.toBeInTheDocument();
  });

  it('disables the Previous button when on the first page', () => {
    render(<Pagination {...defaultProps} page={1} />);
    
    const prevButton = screen.getByRole('button', { name: /previous/i });
    expect(prevButton).toBeDisabled();
  });

  it('enables the Previous button when page is greater than 1', () => {
    render(<Pagination {...defaultProps} page={2} />);
    
    const prevButton = screen.getByRole('button', { name: /previous/i });
    expect(prevButton).not.toBeDisabled();
    
    // Test click interaction
    fireEvent.click(prevButton);
    expect(defaultProps.setPage).toHaveBeenCalled();
  });

  it('disables the Next button when hasMore is false', () => {
    render(<Pagination {...defaultProps} hasMore={false} />);
    
    const nextButton = screen.getByRole('button', { name: /next/i });
    expect(nextButton).toBeDisabled();
  });

  it('enables the Next button when hasMore is true', () => {
    render(<Pagination {...defaultProps} hasMore={true} />);
    
    const nextButton = screen.getByRole('button', { name: /next/i });
    expect(nextButton).not.toBeDisabled();
    
    // Test click interaction
    fireEvent.click(nextButton);
    expect(defaultProps.setPage).toHaveBeenCalled();
  });

  it('disables both buttons while loading', () => {
    render(<Pagination {...defaultProps} page={2} hasMore={true} loading={true} />);
    
    expect(screen.getByRole('button', { name: /previous/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();
  });

  it('updates the page value using the functional update pattern', () => {
    render(<Pagination {...defaultProps} page={2} />);
    
    const nextButton = screen.getByRole('button', { name: /next/i });
    const prevButton = screen.getByRole('button', { name: /previous/i });

    // Click Next
    fireEvent.click(nextButton);
    // Extract the function passed to setPage
    const nextUpdater = defaultProps.setPage.mock.calls[0][0];
    expect(nextUpdater(2)).toBe(3);

    // Click Previous
    fireEvent.click(prevButton);
    const prevUpdater = defaultProps.setPage.mock.calls[1][0];
    expect(prevUpdater(2)).toBe(1);
  });
});