import { render, screen } from '@testing-library/react';
import LoginPage from '@/app/login/page';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock auth context
jest.mock('@/context/auth-context', () => ({
  useAuth: () => ({
    login: jest.fn(),
    isAuthenticated: false,
    isLoading: false,
  }),
}));

describe('LoginPage', () => {
  it('should render login form with email and password fields', () => {
    render(<LoginPage />);

    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('should display hint text with test credentials', () => {
    render(<LoginPage />);

    expect(screen.getByText(/eve.holt@reqres.in/)).toBeInTheDocument();
  });
});
