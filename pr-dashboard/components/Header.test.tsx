/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from './Header';

describe('Header Component', () => {
  // Mock props
  const mockProps = {
    repo: 'vercel/next.js',
    setRepo: jest.fn(),
    onSearch: jest.fn(),
    perPage: 20,
    setPerPage: jest.fn(),
  };

  // Mock window.alert to prevent actual dialogs and track calls
  const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders branding and initial values correctly', () => {
    render(<Header {...mockProps} />);
    
    // Check if branding title exists
    expect(screen.getByText('PR Monitor')).toBeInTheDocument();
    
    // Check if repo input has the correct initial value
    const repoInput = screen.getByPlaceholderText('user / repository');
    expect(repoInput).toHaveValue(mockProps.repo);
    
    // Check if limit input has the correct initial value
    const limitInput = screen.getByRole('spinbutton');
    expect(limitInput).toHaveValue(mockProps.perPage);
  });

  it('calls setRepo when repository input changes', () => {
    render(<Header {...mockProps} />);
    const repoInput = screen.getByPlaceholderText('user / repository');

    fireEvent.change(repoInput, { target: { value: 'facebook/react' } });

    // Verify setRepo was called with the new string
    expect(mockProps.setRepo).toHaveBeenCalledWith('facebook/react');
  });

  it('calls onSearch when the refresh button is clicked', () => {
    render(<Header {...mockProps} />);
    const refreshBtn = screen.getByRole('button', { name: /refresh/i });

    fireEvent.click(refreshBtn);

    // Verify search trigger
    expect(mockProps.onSearch).toHaveBeenCalledTimes(1);
  });

  it('calls setPerPage with the new value when limit is valid', () => {
    render(<Header {...mockProps} />);
    const limitInput = screen.getByRole('spinbutton');

    fireEvent.change(limitInput, { target: { value: '50' } });

    // Verify setPerPage was called with the integer 50
    expect(mockProps.setPerPage).toHaveBeenCalledWith(50);
    expect(alertSpy).not.toHaveBeenCalled();
  });

  it('triggers alert and caps value at 100 when limit exceeds 100', () => {
    render(<Header {...mockProps} />);
    const limitInput = screen.getByRole('spinbutton');

    // Simulate user typing 150
    fireEvent.change(limitInput, { target: { value: '150' } });

    // Verify the alert was triggered
    expect(alertSpy).toHaveBeenCalledWith("⚠️ GitHub API limit: Max 100 PRs per page.");
    
    // Verify setPerPage was called with the capped value of 100
    expect(mockProps.setPerPage).toHaveBeenCalledWith(100);
  });

  it('defaults to 1 if the limit input is cleared or invalid', () => {
    render(<Header {...mockProps} />);
    const limitInput = screen.getByRole('spinbutton');

    // Simulate clearing the input
    fireEvent.change(limitInput, { target: { value: '' } });

    // Verify fallback to 1
    expect(mockProps.setPerPage).toHaveBeenCalledWith(1);
  });
});