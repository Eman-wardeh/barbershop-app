import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '@/app/(auth)/login/page';
import axios from 'axios';
import { useRouter } from 'next/navigation';

jest.mock('axios');

const pushMock = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders login form inputs and button', () => {
    render(<LoginPage />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  test('button is disabled initially', () => {
    render(<LoginPage />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  test('enables button when inputs are filled', () => {
    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@test.com' },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: '123456' },
    });

    const button = screen.getByRole('button');
    expect(button).not.toBeDisabled();
  });

  test('calls API and redirects on login', async () => {
    axios.post.mockResolvedValue({
      data: { success: true },
    });

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@test.com' },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: '123456' },
    });

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('/api/users/login', {
        email: 'test@test.com',
        password: '123456',
      });

      expect(pushMock).toHaveBeenCalledWith('/dashboard');
    });
  });
});