import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../../routes/Authenticator';
import Header from './Header';
import { auth } from '../../firebase';

// Mock firebase auth
jest.mock('../../firebase', () => ({
  auth: {
    onAuthStateChanged: jest.fn(),
    signOut: jest.fn()
  }
}));

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn()
}));

const mockSetIsAuthenticated = jest.fn();

const renderHeader = () => {
  return render(
    <BrowserRouter>
      <AuthContext.Provider value={{ setIsAuthenticated: mockSetIsAuthenticated }}>
        <Header />
      </AuthContext.Provider>
    </BrowserRouter>
  );
};

describe('Header Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('renders header with brand name', () => {
    renderHeader();
    expect(screen.getByText('Expense Track')).toBeInTheDocument();
  });

  test('displays user name when user is logged in', async () => {
    const mockUser = {
      displayName: 'Test User'
    };

    auth.onAuthStateChanged.mockImplementation((callback) => {
      callback(mockUser);
      return () => {};
    });

    renderHeader();
    expect(await screen.findByText('Test User')).toBeInTheDocument();
  });

  test('displays "User" when displayName is not available', async () => {
    const mockUser = {
      displayName: null
    };

    auth.onAuthStateChanged.mockImplementation((callback) => {
      callback(mockUser);
      return () => {};
    });

    renderHeader();
    expect(await screen.findByText('User')).toBeInTheDocument();
  });

  test('handles logout correctly', async () => {
    auth.signOut.mockResolvedValue();
    localStorage.setItem('token', 'test-token');

    renderHeader();
    const userButton = screen.getByRole('button');
    fireEvent.click(userButton);

    const signOutButton = screen.getByText('Sign Out');
    await act(async () => {
      fireEvent.click(signOutButton);
    });

    expect(auth.signOut).toHaveBeenCalled();
    expect(localStorage.getItem('token')).toBeNull();
    expect(mockSetIsAuthenticated).toHaveBeenCalledWith(false);
  });

  test('handles logout error', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    auth.signOut.mockRejectedValue(new Error('Logout failed'));

    renderHeader();
    const userButton = screen.getByRole('button');
    fireEvent.click(userButton);

    const signOutButton = screen.getByText('Sign Out');
    await act(async () => {
      fireEvent.click(signOutButton);
    });

    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});